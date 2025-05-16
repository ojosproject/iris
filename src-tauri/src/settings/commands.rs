use super::config;
use super::structs::Config;
use super::structs::DataPack;
use super::structs::DataPackReceipt;
use chrono::Utc;
use rusqlite::Connection;
use std::fs;
use tauri::AppHandle;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

/// # `get_config` Command
///
/// Returns the `config.json` file as an object. For more information on the
/// structure of `config.json`, check out the Config struct in `structs.rs`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<Config>('get_config').then(c => {
///     setConfig(c);
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_config(app: AppHandle) -> Config {
    config::get_config(&app)
}

#[tauri::command(rename_all = "snake_case")]
pub fn set_config(app: AppHandle, config: Config) {
    config::set_config(&app, config);
}

/// # `complete_onboarding` Command
///
/// Sets the `onboarding_completed` value in the `config.json` to `true`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke("complete_onboarding");
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn complete_onboarding(app: AppHandle) {
    config::set_onboarding_completed(app, true);
}

/// # `import_data_pack` Command
/// Opens a file picker and imports a Data Pack JSON file. Results a Result of
/// either a `DataPackReceipt` or a string error.
///
/// ## TypeScript Usage
/// ```typescript
/// invoke<DataPackReceipt>('import_data_pack').then(r => {
///     setDataPackReceipt(r);
/// });
/// ```
#[tauri::command]
pub async fn import_data_pack(app: AppHandle) -> Result<DataPackReceipt, String> {
    let file_path = app
        .dialog()
        .file()
        .add_filter(".json", &["json"])
        .blocking_pick_file();

    if file_path.is_none() {
        return Err(
            "No JSON file was selected, so no data was imported. Select a JSON file to try again."
                .to_string(),
        );
    }

    let file_contents = fs::read_to_string(file_path.unwrap().to_string()).unwrap();
    let conn = Connection::open(app.path().app_data_dir().unwrap().join("iris.db")).unwrap();

    let mut receipt = DataPackReceipt {
        resources_count: None,
        pro_count: None,
        contacts_count: None,
    };
    let data_pack_result = serde_json::from_str(&file_contents);

    if data_pack_result.is_err() {
        return Err("The JSON object was malformed. Consult the docs for help on creating well-formatted objects.".to_string());
    }

    let data_pack: DataPack = data_pack_result.unwrap();

    if data_pack.pro.is_some() {
        for question in data_pack.pro.unwrap() {
            let result = conn.execute(
                "INSERT INTO pro_question (id, category, question, question_type, lowest_ranking, highest_ranking, lowest_label, highest_label)
                SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8
                WHERE NOT EXISTS (
                    SELECT 1 FROM pro_question WHERE question = ?3 AND category = ?2
                );",
                (
                    if question.id.is_some() { question.id.unwrap() } else { uuid::Uuid::new_v4().to_string() },
                    question.category,
                    question.question,
                    if question.question_type == "rating" && (question.lowest_ranking.is_none() || question.lowest_label.is_none() || question.highest_ranking.is_none() | question.highest_label.is_none()) { return Err("A ProQuestionDataPack object was malformed. Consult the docs for help on creating well-formatted objects.".to_string()) } else { question.question_type },
                    question.lowest_ranking,
                    question.highest_ranking,
                    question.lowest_label,
                    question.highest_label
                ),
            );

            if result.is_err() {
                return Err(format!("SQLite error: {:?}", result.err().unwrap()));
            }

            let receipt_count = result.unwrap();
            if receipt_count > 0 {
                receipt.pro_count = if receipt.pro_count.is_some() {
                    Some(receipt.pro_count.unwrap() + receipt_count)
                } else {
                    Some(receipt_count)
                };
            }
        }
    }

    if data_pack.resources.is_some() {
        for resource in data_pack.resources.unwrap() {
            let result = conn.execute(
                "INSERT OR IGNORE INTO resource (label, description, url, organization, category, last_updated) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                (
                    resource.label,
                    resource.description,
                    resource.url,
                    resource.organization,
                    resource.category,
                    if resource.last_updated.is_some() {resource.last_updated.unwrap()} else { Utc::now().timestamp() as f32 }
                )
            );

            if result.is_err() {
                return Err(format!("SQLite error:\n\n`{:?}`", result.err().unwrap()));
            }

            let receipt_count = result.unwrap();
            if receipt_count > 0 {
                receipt.resources_count = if receipt.resources_count.is_some() {
                    Some(receipt.resources_count.unwrap() + receipt_count)
                } else {
                    Some(receipt_count)
                };
            }
        }
    }

    if data_pack.contacts.is_some() {
        for contact in data_pack.contacts.unwrap() {
            match conn.execute("INSERT INTO contacts(id, name, phone_number, company, email, contact_type, enabled_relay, last_updated)
            SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8
            WHERE NOT EXISTS (
                SELECT 1 FROM contacts WHERE id = ?1 OR name = ?2 OR phone_number = ?3 OR email = ?4
            );",
        (
            if contact.id.is_some() { contact.id.unwrap() } else { uuid::Uuid::new_v4().to_string() },
            contact.name,
            contact.phone_number,
            contact.company,
            contact.email,
            if contact.contact_type.is_some() {contact.contact_type.unwrap()} else { "CAREGIVER".to_string() },
            if contact.enabled_relay.is_some() { contact.enabled_relay.unwrap() } else { false },
            if contact.last_updated.is_some() { contact.last_updated.unwrap() } else { Utc::now().timestamp() as i64 }
        )) {
            Ok(count) => {
                if count > 0 {
                    receipt.contacts_count = if receipt.contacts_count.is_some() {Some(receipt.contacts_count.unwrap() + count)} else {Some(count)}
                }
            },
            Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
        }
        }
    }

    Ok(receipt)
}

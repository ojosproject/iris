use crate::resources::structs::Resource;
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

/// # `get_resources` Command
///
/// Returns all of the resources that are available to Iris.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<Resource[]>('get_resources').then(r => {
///     setResources(r)
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_resources(app: AppHandle) -> Result<Vec<Resource>, String> {
    let mut resources: Vec<Resource> = vec![];
    let app_data_dir = app.path().app_data_dir().unwrap().join("iris.db");
    let conn = match Connection::open(app_data_dir) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    let mut statement = match conn.prepare("SELECT * FROM resource ORDER BY last_updated DESC") {
        Ok(s) => s,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    let matched_resources = match statement.query_map([], |row| {
        Ok(Resource {
            label: row.get(0)?,
            description: row.get(1)?,
            url: row.get(2)?,
            organization: row.get(3)?,
            category: row.get(4)?,
            last_updated: row.get(5)?,
        })
    }) {
        Ok(m) => m,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    for resource in matched_resources {
        if resource.is_ok() {
            resources.push(resource.unwrap());
        }
    }
    Ok(resources)
}

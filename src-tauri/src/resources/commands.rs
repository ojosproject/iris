// File:     resources/commands.rs
// Purpose:  Commands for the Resources tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::{helpers::db_connect, resources::structs::Resource};
use tauri::AppHandle;

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
    let conn = db_connect(&app);

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

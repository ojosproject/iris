use crate::resources::helper;
use crate::resources::structs::Resource;
use tauri::AppHandle;

/// # `get_resources` Command
///
/// Returns all of the resources that are available to Iris. This also checks
/// the GitHub [resources repository](https://github.com/ojosproject/resources)
/// for any updates. Returns a `Resource[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_resources').then(r => {
///     setResources(r as Resource[])
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_resources(app: AppHandle) -> Vec<Resource> {
    helper::get_resources(app.clone())
}

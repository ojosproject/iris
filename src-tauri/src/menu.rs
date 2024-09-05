// menu.rs
// The menu at the top of the app for desktop. Primarily being used for
// development purposes for now.
use std::env;
use tauri::{
    menu::{Menu, MenuBuilder, MenuItemBuilder, Submenu, SubmenuBuilder},
    AppHandle, Manager, Wry,
};

fn submenu_app(app: AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app.app_handle(), "App")
        .quit()
        .build()
        .unwrap()
}

fn submenu_help(app: AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app.app_handle(), "Help")
        .item(
            &MenuItemBuilder::new("Open App Data Folder")
                .id("help_app_data_dir")
                .build(app.app_handle())
                .unwrap(),
        )
        .item(
            &MenuItemBuilder::new("Open App Config Folder")
                .id("help_app_config_dir")
                .build(app.app_handle())
                .unwrap(),
        )
        .separator()
        .item(
            &MenuItemBuilder::new("Import Testing Data")
                .id("import_test_data")
                .accelerator("Ctrl+I")
                .build(app.app_handle())
                .unwrap(),
        )
        .build()
        .unwrap()
}

pub fn menu(app: AppHandle) -> Menu<Wry> {
    let handle = app.app_handle();

    match env::consts::OS {
        "macos" => MenuBuilder::new(handle)
            .item(&submenu_app(handle.clone()))
            .item(&submenu_help(handle.clone()))
            .build()
            .unwrap(),
        "windows" | "linux" => MenuBuilder::new(handle)
            .item(&submenu_help(handle.clone()))
            .build()
            .unwrap(),
        _ => panic!("This operating system is not supported at this time."),
    }
}

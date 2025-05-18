// File:     menu.rs
// Purpose:  The menu at the top of the app for desktop.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use tauri::{
    menu::{AboutMetadata, Menu, MenuBuilder, MenuItemBuilder, Submenu, SubmenuBuilder},
    AppHandle, Manager, Wry,
};
use tauri_plugin_os::platform;

fn submenu_app(app: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app, "App")
        .about(Some(AboutMetadata {
            ..Default::default()
        }))
        .separator()
        .services()
        .separator()
        .hide()
        .hide_others()
        .show_all()
        .separator()
        .quit()
        .build()
        .unwrap()
}

fn submenu_file(app: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app, "File")
        .item(
            &MenuItemBuilder::new("Open Recordings...")
                .id("open-recordings")
                .build(app)
                .unwrap(),
        )
        .build()
        .unwrap()
}

fn submenu_edit(app: &AppHandle) -> Submenu<Wry> {
    match platform() {
        "windows" | "linux" => SubmenuBuilder::new(app.app_handle(), "Edit")
            .cut()
            .copy()
            .paste()
            .select_all()
            .build()
            .unwrap(),
        "macos" => SubmenuBuilder::new(app.app_handle(), "Edit")
            .undo()
            .redo()
            .separator()
            .cut()
            .copy()
            .paste()
            .select_all()
            .build()
            .unwrap(),
        _ => panic!("Unsupported operating system."),
    }
}

fn submenu_view(app: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app.app_handle(), "View")
        .fullscreen()
        .build()
        .unwrap()
}

fn submenu_window(app: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(app.app_handle(), "Window")
        .minimize()
        .separator()
        .close_window()
        .build()
        .unwrap()
}

pub fn menu(app: &AppHandle) -> Menu<Wry> {
    match platform() {
        "macos" => MenuBuilder::new(app)
            .item(&submenu_app(app))
            .item(&submenu_file(app))
            .item(&submenu_edit(app))
            .item(&submenu_view(app))
            .item(&submenu_window(app))
            .build()
            .unwrap(),
        "windows" => MenuBuilder::new(app)
            .item(&submenu_file(app))
            .item(&submenu_edit(app))
            .item(&submenu_window(app))
            .build()
            .unwrap(),
        "linux" => MenuBuilder::new(app)
            .item(&submenu_file(app))
            .item(&submenu_edit(app))
            .build()
            .unwrap(),
        _ => panic!("This operating system is not supported at this time."),
    }
}

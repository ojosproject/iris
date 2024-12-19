use std::process::Output;

use gilrs::{Button, Event, Gilrs};
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn joystick_events(app: AppHandle) {
    let mut gilrs = Gilrs::new().unwrap();
    let mut active_gamepad = None;

    for (_id, gamepad) in gilrs.gamepads() {
        println!("{} is {:?}", gamepad.name(), gamepad.power_info());
    }

    tauri::async_runtime::spawn(async move {
        loop {
            // Examine new events
            while let Some(Event {
                id, event, time, ..
            }) = gilrs.next_event()
            {
                println!("{:?} New event from {}: {:?}", time, id, event);
                active_gamepad = Some(id);
            }

            // You can also use cached gamepad state
            if let Some(gamepad) = active_gamepad.map(|id| gilrs.gamepad(id)) {
                if gamepad.is_pressed(Button::DPadRight) {
                    println!("Button South is pressed (XBox - A, PS - X)");
                }
            }
        }
    });
}

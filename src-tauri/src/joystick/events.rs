use std::time::UNIX_EPOCH;

use gilrs::{Button, Event, Gilrs};
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn joystick_events(app: AppHandle) {
    let mut gilrs = Gilrs::new().unwrap();
    let mut last_request: f64 = 0.0;

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
                // println!("New event from {}: {:?}", id, event);
                let event_epoch = time.duration_since(UNIX_EPOCH).unwrap().as_secs_f64();

                println!("{:?}", event_epoch - last_request);
                if event_epoch - last_request > 1.0 {
                    last_request = event_epoch;
                    match event {
                        gilrs::EventType::ButtonPressed(button, code) => match button {
                            Button::DPadUp
                            | Button::DPadDown
                            | Button::DPadRight
                            | Button::DPadLeft
                            | Button::South => {
                                app.emit(
                                    "joystick-event",
                                    match button {
                                        Button::DPadUp => String::from("up"),
                                        Button::DPadDown => String::from("down"),
                                        Button::DPadLeft => String::from("left"),
                                        Button::DPadRight => String::from("right"),
                                        Button::South => String::from("select"),
                                        _ => panic!("This button is not supported."),
                                    },
                                )
                                .unwrap();
                            }
                            Button::Unknown => todo!(),
                            _ => println!("A different button was selected: {:?}", button),
                        },
                        gilrs::EventType::Connected => println!("Joystick connected."),
                        gilrs::EventType::Disconnected => panic!("Joystick disconnected."),
                        _ => println!("A different event happened."),
                    }
                }
            }
        }
    });
}

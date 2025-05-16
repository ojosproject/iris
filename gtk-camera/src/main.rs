// Developer note:
// Still figuring things out. Following this guide:
// https://gtk-rs.org/gtk4-rs/stable/latest/book/hello_world.html
use gtk::{Application, Button, glib};
use gtk::{ApplicationWindow, prelude::*};
use gtk::glib::clone;

const APP_ID: &str = "org.ojosproject.IrisGTKCamera";

fn main() -> glib::ExitCode {
    let app = Application::builder().application_id(APP_ID).build();
    app.connect_activate(build_ui);
    app.run()
}

fn build_ui(app: &Application) {
    let button_exit = Button::builder().label("Exit").build();
    let button_record = Button::builder().label("Start Recording").build();
    let button_camera = Button::builder().label("Stop Camera").build();
    let button_mic = Button::builder().label("Stop Mic").build();
    let button_recordings_folder = Button::builder().label("View Recordings").build();

    let window = ApplicationWindow::builder()
        .application(app)
        .child(&button_exit)
        .title("Video")
        .build();

    button_exit.connect_clicked(clone!(
        #[weak]
        window,
        move |_| {
            window.close();
        }
    ));
    window.present();
}

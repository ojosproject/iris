# Iris GTK Camera for Linux Devices

## Description

The Iris client uses Tauri, which on Linux uses `webkitgtk`, which doesn't
support `webrtc` yet. Without it, Tauri-built Linux apps cannot provide camera
or microphone support.

The Iris developers' solution to this is creating an app built from
[`gtk-rs`](https://gtk-rs.org/) with video recording capabilities that would be
spawned with the Iris client. You can find more information about this in
[iris#42](https://github.com/ojosproject/iris/issues/42).

### Features

The Iris GTK Camera's features should basically be what the Iris Video tool
would have been, except we're going to use GTK instead of web technologies.

## Contributing

A Linux device or virtual machine is required to contribute.

To begin,
[install the dependencies](https://gtk-rs.org/gtk4-rs/stable/latest/book/installation_linux.html).
All work happens inside of the `gtk-camera` folder in the Iris client
repository. We're still in the "figuring things out" phase.

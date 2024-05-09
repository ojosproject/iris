# Creating a GObject

We're going to have to use the [GTK PyGObject](https://pygobject.gnome.org/)
toolkit to create widgets for the GUI. This is going to be a guide made by the
Developers team.

> [!WARNING]
> This is a work in progress.

We're going to use the [GNOME Music](https://gitlab.gnome.org/GNOME/gnome-music)
app source code as reference.

## Running `demo.py`

> ![WARNING]
> To run `demo.py`, you must use either Linux or macOS. This goes not work with
Windows and is something actively being looked at for Carlos.

## Different Classes

| Class             | Purpose               |
| ----------------- | --------------------- |
| `Gtk.Button`      | A button              |
| `GObject.GObject` | A general object      |
| `@Gtk.Template`   | Requires a `.ui` file |

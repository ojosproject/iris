# main.py
# Ojos Project
#
# This is the file where it all begins.
from Database import Database

# DB = Database("some path")

if __name__ == "__main__":
    import sys
    import gi

    gi.require_version("Gtk", "4.0")
    from gi.repository import GLib, Gtk

    class MyApplication(Gtk.Application):
        def __init__(self):
            super().__init__(application_id="org.ojosproject.Iris")
            GLib.set_application_name('Iris Hospice Management System')

        def do_activate(self):
            window = Gtk.ApplicationWindow(
                application=self, title="Iris Hospice Management System")
            window.fullscreen()
            window.present()

    app = MyApplication()
    exit_status = app.run(sys.argv)
    sys.exit(exit_status)

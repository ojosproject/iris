import gi
from gi.repository import Gtk


class Text(Gtk.Text):
    __gtype_name__ = "Text"

    def __init__(self):
        self.set_text("This is some text!")


class Demo(Gtk.TextView):
    __gtype_name__ = "A simple text view."

    def __init__(self):
        self.__init__()

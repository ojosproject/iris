#!/bin/bash
# pre-install.sh
# Ojos Project
# 
# Installs dependencies needed by PyGObject.

if command -v apt-get &> /dev/null; then
    echo "Installing dependencies with apt-get..."
    sudo apt-get install libgirepository1.0-dev gcc libcairo2-dev pkg-config python3-dev gir1.2-gtk-4.0 -y
elif command -v dnf &> /dev/null; then
    echo "Installing dependencies with dnf..."
    sudo dnf install gcc gobject-introspection-devel cairo-gobject-devel pkg-config python3-devel gtk4
elif command -v brew &> /dev/null; then
    echo "Installing dependencies with brew..."
    brew install pygobject3 gtk4
fi

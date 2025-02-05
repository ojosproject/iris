# Tools in the Iris Software

Iris itself doesn't do much besides store data on a computer. However, what
makes Iris special is the tools that are developed.

## Definition of a "tool"

In Iris, a tool can be a set of pages to achieve a function, or a collection of
functions that help other tools. An example of a page-related tool can be the
Medications tool, where you need to interact with the UI to function. An example
of a functions-related tool can be the Relay functionality, which doesn't
require a dedicated full page for it to function.

## Where are tools located?

In the code, tools are located in
[`/src/app/`](../../src/app/) (frontend) and
[`/src-tauri/src/`](../../src-tauri/src/) (backend). The tool folder's name
should be the same in both locations.

## Documenting tools

Tools should either (have a Markdown file OR collection of Markdown files in a
folder) to document how it works, as well as anything we may need to know, such
as backend Tauri commands and how to use them. Documentation is crucial to the
project and should be as up to date as possible.

## Creating a tool

To learn about creating a tool, please read the
[Creating an Iris Tool](../design/create-a-feature.md) document.

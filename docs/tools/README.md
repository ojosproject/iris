# Tools in the Iris Software

When you start Iris, you will be greeted with the Iris Hub, a page full of tools.
Tools such as **Medications**, **Video**, **Settings**, etc. A "tool" in Iris can
mean:

- A visual page that carries out a function (i.e.: med logging, calling, etc.)
- A set of shared code functions/components (i.e.: AI, relay notifications, etc.)

## Metadata for a tool

Every tool must have:

- **An ID.** This ID should be the lowercased and underlined version of the
  tool's name.
- **A name.** A tool that users can refer to it as

If your tool is a frontend tool, there are more requirements:

- **An icon.** This will be the icon displayed in the Hub.

## Tools in the repository

In the code, all of a tool's code will be kept in a folder named after the tool
ID. Ojos Project's developers already maintain a few tools, such
as `medications`, `call`, `care-instructions`, `ai`, `pro`, `resources`, and
`settings`.

Tool folders may be located in:

- `/docs/tools/[toolId]` (documentation)
- `/src/app/[toolId]` (frontend)
- `/src-tauri/src/[toolId]` (backend)

Tools can be flexible. You may or may not need a frontend or a backend. You will
need documentation.

## What is Iris without the tools?

Iris acts as a data management and notification system. It keeps data
about your patient's care locally and sends notifications to caregivers.

### As a data management system

The way Iris acts as a data management system is by requiring tools to have a
SQL schema. When Iris first starts up, it will take the schema and combine it
with other tools' schema, creating a unified database.

### As a notification system

When it comes to notifications, Iris must connect to an Iris server, maintained
in [this repository](https://github.com/ojosproject/api). Iris will connect to
the server, and use it to send notifications using external services, such as
Twilio.

### As a directory for tools

Iris also acts as a directory for tools. When you start Iris, you'll be taken
to the Iris Hub that displays all available tools, as mentioned above.

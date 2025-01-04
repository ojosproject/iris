# List of Maintainers

Iris is a project with multiple layers to it. Every link in the Iris Hub is
meant to represent a part of Iris that is maintained. This file exists to list
out who is responsible for each part of Iris.

This list exists to help you know who to contact about a specific aspect of the
project.

> [!IMPORTANT]
> Although some spots are vacant, that does not mean Ojos Project is looking for
> maintainers. Rather, members have not yet been assigned.

## Table of Contents

- [List of Maintainers](#list-of-maintainers)
  - [Table of Contents](#table-of-contents)
  - [How to add to this list](#how-to-add-to-this-list)
  - [Repository](#repository)
  - [Video Recording](#video-recording)
  - [Care Instructions](#care-instructions)
  - [Core](#core)
  - [Relay Notifications](#relay-notifications)
  - [Medications (\& Logging)](#medications--logging)
  - [Patient-Reported Outcomes](#patient-reported-outcomes)
  - [Resources](#resources)
  - [Settings](#settings)
  - [Artificial Intelligence](#artificial-intelligence)
  - [Joystick Support](#joystick-support)

## How to add to this list

Please use this template.

```markdown
## Feature

Give it a description. It doesn't have to be long.

- Maintainers:
  - ...
- Designers:
  - ...
- Folders:
  - ...
- Files:
  - ...
```

For individuals, please use the `firstName lastName <emailAddress>` format.
Folders should also be in monospace.

If there's only one value per label, add the value inline and remove the `s`.
For example, if there's only one maintainer, **do not write this**:

```markdown
<!-- NOTE: Please do not do this. -->

- Maintainers
  - `Carlos Valdez <cvaldezh@uci.edu`
```

**Instead, write this:**

```markdown
- Maintainer: `Carlos Valdez <cvaldezh@uci.edu>`
```

## Repository

Maintainer of the entire repository. Responds to issues, merges PRs, updates
files outside of code, etc.

- Maintainer: `Carlos Valdez <cvaldezh@uci.edu>`
- Folders: `/`

## Video Recording

Video recording capabilities to monitor the patient.

- Maintainer: `Carlos Valdez <cvaldezh@uci.edu>`
- Designer: N/A
- Folders:
  - `/src/app/call/`
  - `/tauri-src/src/call/`

## Care Instructions

Leave behind notes regarding your patient's care instructions.

- Maintainer: N/A
- Designer: N/A
- Folders:
  - `/src/app/care_instructions/`
  - `/src-tauri/src/care_instructions/`

## Core

> [!WARNING]
> Some files in the "core" folders are files that have yet to been added to its
> own feature folder, such as the `config.rs` file. These are to be moved soon.

There are two definitions for "core" features: 1) a component or function
meant to be shared with other features, or 2) the bare essentials to get Iris
up and running.

- Maintainer: `Carlos Valdez <cvaldezh@uci.edu>`
- Designer: N/A
- Folders:
  - `/src/app/core/`
  - `/src-tauri/src/core/`

## Relay Notifications

A feature to notify caregivers about their patient's care. This feature is being
developed alongside the [Iris API](https://github.com/ojosproject/api/).

- Maintainer: N/A
- Designer: N/A
- File: `/src-tauri/src/core/relay.rs`

## Medications (& Logging)

Medication management capabilities for patients.

- Maintainers:
  - Frontend: N/A
  - Backend: `Carlos Valdez <cvaldezh@uci.edu>`
- Designer: N/A
- Folders:
  - `/src/app/medications/`
  - `/src-tauri/src/medications/`

## Patient-Reported Outcomes

Surveys about a patient's care. Results to be used by nurses/agencies to track
whether the patient's care is efficient or not.

- Maintainer: N/A
- Designer: N/A
- Folders:
  - `/src/app/pro/`
  - `/tauri-src/src/pro/`

## Resources

A list of resources for people going through EoL care.

- Maintainer: N/A
- Designer: N/A
- Folders:
  - `/src/app/resources/`
  - `/tauri-src/src/resources/`

## Settings

A page to manage the program's settings.

- Maintainer: `Carlos Valdez <cvaldezh@uci.edu>`
- Designer: N/A
- Folder: `/src/app/settings/`

## Artificial Intelligence

Opt-in features for artificial intelligence.

- Maintainer: N/A
- Folder: `/src-tauri/src/ai/`

## Joystick Support

Allows patients with limited capabilities to control Iris using a console game
controller.

- Maintainer: `Carlos Valdez <cvaldezh@uci.edu`
- Folders:
  - `/src/app/joystick/`
  - `/src-tauri/src/joystick/`

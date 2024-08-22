# Tauri Commands in Iris

Tauri commands are a way to pass information between the frontend and the
backend. The backend defines the commands and the frontend uses them.

> [!IMPORTANT]
> This guide will assume you're using TypeScript, therefore will only use
> TypeScript in this guide.

## Table of Contents

- [Tauri Commands in Iris](#tauri-commands-in-iris)
  - [Table of Contents](#table-of-contents)
  - [Legend](#legend)
  - [Resources](#resources)
  - [Authentication](#authentication)
  - [Current Commands](#current-commands)
    - [❌ authenticate\_user](#-authenticate_user)
    - [❌ create\_user](#-create_user)
    - [❌ get\_medications](#-get_medications)
    - [👷 get\_upcoming\_medications](#-get_upcoming_medications)

## Legend

| Emoji | Description     |
| ----- | --------------- |
| ❌     | Not implemented |
| 👷     | In progress     |
| ✅     | Implemented     |

## Resources

- [Calling Rust from the Frontend](https://v2.tauri.app/develop/calling-rust/)
- [`types.ts`](../src/types.ts)

## Authentication

Authentication will be required for most commands, requiring a `credential`
argument.

A `credential` is just a password as a string. We will eventually create a more
secure method to create a credential, but for now it's just any string.

Every user will be identified through their password.

## Current Commands

### ❌ authenticate_user

> [!IMPORTANT]
> The `credential` parameter is required.

Authenticates the user. Returns a User object.

Usage:

```javascript
import { invoke } from "@tauri-apps/api/core";

invoke("authenticate_user", {credential: ""}).then((user) => {
    // todo: implement
}).catch((e) => {
    console.log(e);
})
```

### ❌ create_user

> [!IMPORTANT]
> The `credential` parameter is required.
>
> Backend will soon make it so that the first time you use `create_user`, a
> `credential` won't be necessary.

Requests a new user be created. If successful, returns a User object.

Parameters:

- `full_name: string`: The full name of the new user
- `type_of: string`: `PATIENT` for now

Usage:

```javascript
import { invoke } from "@tauri-apps/api/core";

invoke("create_user", {credential: "", first_name: "John Doe", type_of: "PATIENT"}).then((user) => {
    // todo: implement
}).catch((e) => {
    console.log(e);
})
```

### ❌ get_medications

> [!IMPORTANT]
> The `credential` parameter is required.

Collects all medications and returns them as a `Medication[]`.

Usage:

```javascript
import { invoke } from "@tauri-apps/api/core";

invoke("get_medications", {credential: ""}).then((medications) => {
    // todo: implement
}).catch((e) => {
    console.log(e);
})
```

### 👷 get_upcoming_medications

> [!IMPORTANT]
> The `credential` parameter is required.

Collects upcoming medications and returns them as a `Medication[]`.

Usage:

```javascript
import { invoke } from "@tauri-apps/api/core";

invoke("get_upcoming_medications", {credential: ""}).then((upcoming_medications) => {
    // todo: implement
}).catch((e) => {
    console.log(e);
})
```

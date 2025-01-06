# Creating an Iris Tool

When you go to the home page of Iris, you see a lot of different icons that,
when clicked, takes you to a new page. These icons are tools. Some of the
current tools are **Medication Logging**, **Video Call**, **Resources**, and
more coming soon. However, it *is* possible to build your own tool if you'd like
to add a feature to Iris!

> [!IMPORTANT]
> This document assumes you've read the
> [`CONTRIBUTING.md` doc](../../CONTRIBUTING.md) and the [tools page](./tools.md).

## Important Files/Folders

- Frontend
  - `src/app/`: Folders containing page contents
  - `src/app/core/HubApps.ts`: Includes a `HubApps` constant
  - `src/core/helper.ts`: TS functions/consts that could be helpful everywhere
  - `src/core/components/`: Common components like Button, BackButton, etc.
  - `public/images/`: Where icon images are kept
- Backend
  - `src-tauri/src/`: Files for backend functionality
  - `src-tauri/src/main.rs`: Commands that send data from the backend
  - `src-tauri/src/core/config.rs`: Config file functions for quick settings
  - `src-tauri/src/core/structs.rs`: Contains the `Config` struct

## Tool metadata

Every tool must have:

- **An ID.** This ID should be the lowercased and underlined version of the
  tool's name. Also the name of your tool folder.
- **A name.** A tool that users can refer to it as

If your tool is a frontend tool, there are more requirements:

- **An icon.** This will be the icon displayed in the Hub.

## Creating an icon in the hub

The first step to adding your new tool is to add an object to the `HubApps`
content in the [`HubApps.ts` file](../../src/app/core/HubApps.ts). There's three keys you
need to add an icon to the hub:

| Key    | Description                                                      |
| ------ | ---------------------------------------------------------------- |
| `link` | Relative link to the folder in `src/app/`, named after a tool ID |
| `name` | The tool name                                                    |
| `icon` | Link to the image file in `public/images/`                       |

If you don't have an `icon` image, feel free to leave it out. Your icon will
still appear in the Hub, though it will just be a blue square.

As soon as you add your object to the `HubApps` array, it will be displayed on
the Hub.

## Developing the frontend

You must create a tool folder in [`/src/app/`](../../src/app/). You must create
the following files inside the tool folder:

- `page.tsx`
- `page.module.css`
- `types.ts`
- `components/` folder

The `link` you provide in the `HubApps` array *must* be the name of your tool
folder. For example, the Resources icon's `link` value is `./resources` because
the folder name is `src/app/resources/`.

Inside of that folder, you *must* include a `page.tsx` file, which will become
the first page that opens when users click on your new icon. Here's a template
of what you can add to your `page.tsx`:

> [!WARNING]
> If you do not correctly set the `link` or add a `page.tsx` file, users will
> be taken to a 404 page when they click your icon.

```jsx
// page.tsx
// Ojos Project
//
// Insert a description of your tool here!
"use client";
import classes from "./page.module.css";

export default function RenameMe() {
    return <></>
}
```

Once you're done with that, feel free to start developing as you usually would
with React. Keep all of your tool's files inside of the folder you created.

> [!TIP]
> If your tool requires a backend, please use the types found in the
> `types.ts` file. These types help you understand the structure of the returned
> data from the backend.
>
> It's backend's responsibility to ensure both types and structs are synced.

## Developing the backend

If you need a backend, you'll need to interact with our Rust backend.

You must create a tool folder in [`/src-tauri/src/`](../../src-tauri/src/). You
must create the following files inside the tool folder:

- `commands.rs`
- `helper.rs`
- `mod.rs`
- `schema.sql`
- `structs.rs`

You must add `mod folder_name` at the top of the `main.rs` file to make the
folder visible to the program.

### Storing data

Iris has two ways to store data in the backend, both with their own beneficial
ways. If you need to store quick information like settings, you should work with
the `config.rs` file. Otherwise, if you want to
store a *lot* of data, you should use the Iris database.

> [!IMPORTANT]
> If you modify **any** structure in the `structs.rs` file, please also modify
> the `types.ts` file inside of frontend's tool folder too. These types help
> the frontend know how the data will be returned.
>
> It's backend's responsibility to ensure both types and structs are synced.

#### Storing data in the config file

> [!WARNING]
> You are editing a feature in the `core` folder. Be careful.

Iris keeps a `config.json` file on users' computers to keep quick settings about
the program.

The `Config` structure in the core
[`structs.rs`](../../src-tauri/src/core/structs.rs) file is where you begin. Add
the name of the key in this structure as well as the key type. Next, fix issues
that *will* appear in the [`config.rs`](../../src-tauri/src/core/config.rs) file
because of your `structs.rs` changes. **This is normal.**

Now, add any functions in the `config.rs` that will help you store information.

#### Storing data in the database

Iris also keeps a `Iris.db` file on users' computers with SQLite. Iris uses
the `rusqlite` crate to work with it. Extensive data of similar types should
be kept in the Iris database.

You first begin with the `schema.sql` file.
Create a new table for the type of data you want to store, as well as their
types. Please add comments to document your code! Next, add a brand new
structure inside of your folder's `structs.rs` file.
Make sure your `schema.sql` and `structs.rs` structures are similar so that
your backend code does not crash.

From here on out, you can now write the Rust code you need to make the backend
functional. You may want to read the
[`rusqlite` docs](https://docs.rs/rusqlite/latest/rusqlite/).

### Sending backend data to the frontend

Iris is built using [Tauri](https://tauri.app/). Your tool folder includes a
`commands.rs` file to include functions that act as Tauri commands. If you've
worked with web technologies and APIs before, consider Tauri commands as API
endpoints.

Please
[read the Tauri docs for commands](https://tauri.app/develop/calling-rust/).
When you create your new command, please add the function name to the
`.invoke_handler()`'s arguments alongside the other commands in the `main.rs`
file.

Your tool folder also includes a `helper.rs` file for helper functions for
your Tauri commands.

## Conclusion

Hopefully this document gave you a place to start when it comes to adding a new
page to Iris. There may be more complicated things you want to try to implement,
and if that's the case, please feel free to reach out to the Iris developers
on Discord.

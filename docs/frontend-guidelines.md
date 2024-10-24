# Iris Guidelines for Frontend Development

Development for the frontend in this project can be a bit challenging seeing as
how we're working with various layers. First we're getting our code to work with
React, then getting our React code to work with NextJS, then getting our NextJS
code to work with Tauri. With these many layers, there may be instances where
code is incompatible with each other. Therefore, these guidelines are here to
ensure our code works through all layers.

> [!NOTE]
> These guidelines are written for Iris frontend developers. Backend should only
> be focused on the Tauri side of things, as that's the only layer they should
> focus on.

## Start in the browser

React/NextJS is meant to produce code for the browser, so when you start coding,
start with the browser. You can do so with the following command:

```shell
npm i
npm run dev
```

If your code is successfully working in the browser, continue with Tauri.

> [!IMPORTANT]
> Sometimes you may have to use [Tauri plugins](https://v2.tauri.app/plugin/) in
> the frontend that may not be compatible with the browser. If that's the case,
> you're going to have to start developing in Tauri.
>
> **Please use Tauri plugins if they have a plugin for something you need to
> implement.**

## Continue with Tauri

If your code works in the browser, continue with Tauri. However, if you notice
that something is *programmatically* working in the browser that isn't working
in Tauri, it may just be a
[permissions](https://v2.tauri.app/security/permissions/) or
[capabilities](https://v2.tauri.app/security/capabilities/) issue. **If it's a
programming issue, notify backend developers to take a look at it.**

However, if it's a *styling* issue, please continue your work in Tauri until the
styling looks just right in the window.

You can start working with Tauri using the following command:

```shell
cargo tauri dev
```

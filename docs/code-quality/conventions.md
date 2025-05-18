# Conventions

<!-- markdownlint-disable MD005 MD029 -->

1. Frontend (React/NextJS/`src/*`)
   1. Every file must have a [comment header](#comment-headers)
   2. Use camelCase for variable/function/style names, not underscore_case.
   3. Use UpperCase for component names
   4. All shareable components must be kept in `src/components/`
   5. All shareable functions must be kept in `src/utils/`
   6. All shareable types must be kept in `src/types/`
   7. We're using the [app router](https://nextjs.org/docs/14/app/building-your-application/routing#the-app-router)
   8. Use [`<Image>`](https://nextjs.org/docs/14/app/api-reference/components/image) for images
   9. Set `draggable` to `false` in all images and links
   10. For components, use functional declarations over arrow function expressions
   11. Add a `ComponentProps` type for every `Component` with props
   12. `throw` errors. Do not use `console.log()` or `console.error()` for errors
   13. File/folder Naming
       1. [Prefix files with `_`](https://nextjs.org/docs/14/app/building-your-application/routing/colocation#private-folders) if they're not part of the route in `src/app/*`. Examples:
          * `_components`
          * `_helper.ts`
       2. Use kebab-case for file and folder names
   14. Styling
       1. Global styling must be kept in `globals.css`
       2. Any other styling is done with [CSS Modules](https://nextjs.org/docs/14/app/building-your-application/styling/css-modules)
       3. Import CSS Modules as `styles`
       4. Use the color variables were appropriate:
          * `var(--dark-blue)`
          * `var(--blue)`
          * `var(--light-blue)`
          * `var(--white)`
          * `var(--dark-gray)`
          * `var(--black)`
   15. Navigation
       1. Use [`<Link>`](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating#link-component) instead of `<a>`
       2. Use [`useRouter()`](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating#userouter-hook) instead of `window.location`
       3. Use [`router.push()`](https://nextjs.org/docs/14/app/api-reference/functions/use-router) instead of `router.back()`
   16. Use [Module Path Aliases (`@/`)](https://nextjs.org/docs/14/app/building-your-application/configuring/absolute-imports-and-module-aliases) when importing `src/components/`, `src/utils/`, etc.
   17. Use `export default` in the function declaration instead of the EoF
2. Backend (Rust/Tauri/`src-tauri/src/*`)
   1. Every file must have a [comment header](#rust-rs)
   2. Use snake_case for file names, folders, variables, and functions
   3. Use UpperCase for structs
   4. All shareable functions must be kept in the root `helpers.rs` file
   5. Return a `Result<(), String>` with all commands, where `()` is up to you
   6. Use `.expect()` over `.unwrap()`
   7. Implement proper error handling

## Comment Headers

Iris source code files should include comment headers explaining three things
about the software: **file name**, **file purpose**, **authors**, and
the source code **license**.

Below are some templates.

### TypeScript, TSX Components

```tsx
/**
 * File:     [filename].tsx
 * Purpose:  [Brief description of the component's purpose]
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
```

### CSS, CSS Modules (`.css`/`.module.css`)

```css
/* ==========================================================================
   File:     [filename].module.css
   Purpose:  [Brief description of the file's purpose.]
   Authors:  Ojos Project & Iris contributors
   License:  GNU General Public License v3.0
   ========================================================================== */
```

### Rust (`.rs`)

```rust
// File:     [filename].rs
// Purpose:  [Brief description of the file's purpose.]
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
```

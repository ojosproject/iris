# Conventions

1. Frontend (React/NextJS/`src/app/*`)
   1. Every file must have a [comment header](#comment-headers)
   2. Use camelCase for variable/function/style names, not underscore_case.
   3. Use UpperCase for component names
   4. We're using the [app router](https://nextjs.org/docs/14/app/building-your-application/routing#the-app-router)
   5. Use [`<Image>`](https://nextjs.org/docs/14/app/api-reference/components/image) for images
   6. For components, use functional declarations over arrow function expressions
   7. Add a `ComponentProps` type for every `Component` with props
   8. `throw` errors. Do not use `console.log()` or `console.error()` for errors
   9. File/folder Naming
      1. [Prefix files with `_`](https://nextjs.org/docs/14/app/building-your-application/routing/colocation#private-folders) if they're not part of the route. Examples:
         * `_components`
         * `_helper.ts`
      2. Use kebab-case
   10. Styling
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
   11. Navigation
       1. Use [`<Link>`](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating#link-component) instead of `<a>`
       2. Use [`useRouter()`](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating#userouter-hook) instead of `window.location`
       3. Use [`router.push()`](https://nextjs.org/docs/14/app/api-reference/functions/use-router) instead of `router.back()`

## Comment Headers

Iris source code files should include comment headers explaining three things
about the software: **file name**, **file description**, **developer(s)**, and
the source code **license**.

Below are some templates.

### CSS, CSS Modules (`.css`/`.module.css`)

```css
/* ==========================================================================
   File:     [filename].module.css
   Purpose:  [Brief description of the file's purpose.]
   Authors:  Ojos Project & Iris contributors
   License:  GNU General Public License v3.0
   ========================================================================== */
```

### TypeScript, TSX Components

```tsx
/**
 * File:     [filename].tsx
 * Purpose:  [Brief description of the component's purpose]
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
```

# Iris Contribution Guidelines

![Ojos Project header](https://ojosproject.org/images/header.png)

## Table of Contents

- [Iris Contribution Guidelines](#iris-contribution-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [Background](#background)
    - [Our Involvement](#our-involvement)
    - [Get in contact](#get-in-contact)
    - [License](#license)
  - [How to Contribute](#how-to-contribute)
    - [Submitting Feedback with Issues](#submitting-feedback-with-issues)
    - [Writing documentation](#writing-documentation)
    - [UI/UX Design](#uiux-design)
    - [Community Building](#community-building)
    - [Writing Code](#writing-code)
  - [Code Contributions](#code-contributions)
    - [`git` policies](#git-policies)
    - [Recommended Reading Material](#recommended-reading-material)
    - [Setting up your coding environment](#setting-up-your-coding-environment)
      - [Tauri](#tauri)
      - [Next.js](#nextjs)
    - [Run the program](#run-the-program)
    - [Clearing Iris Data](#clearing-iris-data)
    - [Now what?](#now-what)

## Introduction

### Background

First and foremost, thank you for wanting to contribute to Iris.

The Ojos Project is a research project started at the [University of California,
Irvine](https://uci.edu/) with the goal of making the hospice experience less
complicated. [Carlos Valdez](https://github.com/calejvaldez/)'s grandmother was
in hospice, and he witnessed firsthand some of the difficulties that can arise
in hospice care.

With the help of Professor [Mark S. Baldwin](https://markbaldw.in/), the Ojos
Project team researched academic articles, conducted interviews, and collected
data about hospice care to ensure we create something meaningful.

Iris is the outcome of that effort.

### Our Involvement

This repository is the primary space for the Developers team of the Ojos Project
to work on Iris. Since day 1, the Ojos Project has been transparent about our
work, and that does not change with this repository.

We file issues in this space, we collaborate in this space, send commits in this
space, and more.

> [!TIP]
>
> Want to talk with the team? Feel free to join our Discord server!

### Get in contact

You can contact the team via <developers@ojosproject.org> or through our
[Discord server](https://discord.gg/qZyQadbuMG).

### License

This is a reminder that Iris is under the GNU General Public License v3. Please
view the [`LICENSE`](/LICENSE.md) file for more information.

## How to Contribute

### Submitting Feedback with Issues

Submitting Issues may be the easiest way to contribute to the Ojos Project. If
you want to submit an issue, please be sure to be clear, concise, and
responsive.

Here's a few good examples:

- Bug report: ojosproject/website#24
- Feature request: ojosproject/website#13
- Documentation change: ojosproject/docs#21

> [!WARNING]
> **Reminder regarding security vulnerabilities:**
>
> Please do not submit security vulnerabilities using GitHub Issues. Please
> review the [`SECURITY.md` file for more information](/SECURITY.md).

### Writing documentation

Since Iris is not yet production-ready, we are keeping all Iris-related
documentation in the `docs` folder at the root of the repository. It's written
in simple Markdown!

Once Iris is production ready, we will be publishing the documents on
[ojosproject.org](https://ojosproject.org/docs/).

### UI/UX Design

The Ojos Project primarily uses [Figma](https://figma.com/) for our designs.
You can visit the
[Iris Software Design](https://ojosproject.org/docs/url/developers/design/) page
to see various examples of designs by us.

If you'd like to help with this aspect of the project, please contact Carlos so
that he gives you access to the Figma projects and gets you set up.

Ojos Project primarily uses [Figma](https://figma.com/) for our designs. Our
main designer is [Jesse](https://github.com/jessed7).

### Community Building

The Ojos Project doesn't just want to be centered around UCI. If you'd like to
start your own team of contributors at your university or institution, please
contact [Carlos Valdez](https://github.com/calejvaldez/) so that we can
coordinate our efforts. We can't wait to work with you!

### Writing Code

And, of course, you can contribute to Iris directly by writing code. Please view
the [Code Contributions](#code-contributions) section below for more
information.

## Code Contributions

### `git` policies

Please make sure to follow our
[git policies](https://ojosproject.org/docs/policies/git/).

### Recommended Reading Material

It may be useful to read the following resources before development:

- [Quick Start - React](https://react.dev/learn)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [NextJS App Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Clear explanation of Rust’s module system](https://www.sheshbabu.com/posts/rust-module-system/)
- [Creating an Iris feature](./docs/design/create-a-feature.md)

### Setting up your coding environment

Before you clone the repository, please:

1. Install NodeJS using [nvm](https://github.com/nvm-sh/nvm) or an equivalent tool
2. Follow [Tauri's prerequisite guide](https://tauri.app/start/prerequisites/)
3. Follow the [Rust install guide](https://www.rust-lang.org/tools/install)
4. Install the Tauri CLI: `cargo install tauri-cli --version "^2.0.0" --locked`
5. VSCode (Optional)
   1. Install recommended plugins with `@recommended`

```shell
# Clone the repository with SSH (or HTTPS)
git clone git@github.com:ojosproject/iris.git
cd iris
```

#### Tauri

Iris is written with a lot of different tools; however, we primarily use the
[Tauri](https://tauri.app/) toolkit, which requires [Rust](https://rust-lang.org/).

#### Next.js

Because of Tauri, we're also allowed to write the frontend using
[Next.js](https://nextjs.org/) using [React](https://react.dev/) and
[Typescript](https://www.typescriptlang.org/).

### Run the program

Please install the npm dependencies:

```shell
nvm use
npm i
```

... then run this to run the full program:

```shell
cargo tauri dev
# npm run tauri dev   <-- also works!
```

### Clearing Iris Data

When developing, you may want to clear the data produced by Iris to get a fresh
experience. To do so, you should run the following commands on the terminal:

- **Windows**: `rm -r -fo ~/AppData/Roaming/org.ojosproject.Iris`
- **macOS**: `rm -fr ~/Library/'Application Support'/org.ojosproject.Iris`
- **Linux**: `rm -fr ~/.local/share/org.ojosproject.Iris; rm -fr ~/.config/org.ojosproject.Iris`

### Now what?

Start programming! A good place to start may be the
[Creating an Iris feature](./docs/create-a-feature.md) doc.

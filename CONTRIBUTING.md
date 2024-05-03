# Iris Contribution Guidelines

![Ojos Project header](https://ojosproject.org/images/header.png)

## Table of Contents

- [Iris Contribution Guidelines](#iris-contribution-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [Background](#background)
    - [Our Involvement](#our-involvement)
    - [Our Work](#our-work)
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
    - [Setting up your coding environment](#setting-up-your-coding-environment)
      - [Installing dependencies](#installing-dependencies)
      - [Run the program](#run-the-program)
      - [Visual Studio Code](#visual-studio-code)

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

### Our Work

> [!IMPORTANT]
> If you'd like to contribute code, please review these diagrams before
> continuing.

Before coding, we created various diagrams to help us outline the architecture
of Iris. I suggest giving a look at that before contributing code:

- [Iris C4 Model](https://ojosproject.org/docs/url/developers/c4-model/): The
  [C4 Model](https://c4model.com/) is a set of diagrams that help us outline the
  architecture of Iris. It includes
  - A system context diagram
  - Container diagram
  - Component diagram
  - Code diagram
- [Iris Database Schema](https://ojosproject.org/docs/url/developers/database-schema/):
  The Iris Database Schema helps us visualize the type of data our database file
  will include. This helps us know how to structure our classes
- [Iris Flowcharts](https://ojosproject.org/docs/url/developers/flowcharts/):
  The Iris Flowcharts indicate how our system will work in various different
  situations.

There may be more diagrams available at
[Iris Software Design](https://ojosproject.org/docs/url/developers/design/).

### Get in contact

There's a few ways to get in contact with the Ojos Project team, but one of the
most effective ways may be with our
[Slack workspace](https://ojosproject.slack.com/). However, you may also contact
[Carlos Valdez](https://github.com/calejvaldez) by email at
[cvaldezh@uci.edu](mailto:cvaldezh@uci.edu).

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

You can also contribute to Iris by helping us ensure that our documentation is
always up to date! For more information on that, please go to our [website
repository](https://github.com/ojosproject/website/), as we hold all of our
documentation there.

Our documentation is written with Markdown and
[Docusaurus](https://docusaurus.io/), making it an easy experience for everyone!

You can help by updating the [README file](/README.md), this contribution guide,
API Documentation, tutorials, and guides for Iris.

### UI/UX Design

The Ojos Project primarily uses [Figma](https://figma.com/) for our designs.
You can visit the
[Iris Software Design](https://ojosproject.org/docs/url/developers/design/) page
to see various examples of designs by us.

If you'd like to help with this aspect of the project, please contact Carlos so
that he gives you access to the Figma projects and gets you set up.

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

> [!WARNING]
> Before coding, please be sure to review the diagrams in [Our Work](#our-work),
> as it explains the software architecture of Iris.

### `git` policies

Please make sure to follow our
[git policies](https://ojosproject.org/docs/policies/git/).

### Setting up your coding environment

```shell
# Clone the repository
git clone git@github.com:ojosproject/iris.git
cd iris
```

#### Installing dependencies

Before anything, you must install PyGObject, the Python wrapper for GTK. You
can
[go to their website to install](https://pygobject.gnome.org/getting_started.html).

This program uses [Pipenv](https://pipenv.pypa.io/en/latest/). Please learn how
to use it using
[this guide from the Developers team](https://ojosproject.org/docs/url/developers/using-pipfiles/).

To install the dependencies, run:

```shell
pipenv install
```

#### Run the program

To run the program, run:

```shell
pipenv run start
```

#### Visual Studio Code

If you use [Visual Studio Code](https://code.visualstudio.com/), we have a few
extensions that may be useful for you to use.

When you open the repository in VS Code, you can open the Extensions tab and
type `@recommended` to see all of the extensions we use. Please install them.

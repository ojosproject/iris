# Testing and code coverage

This document will go over testing and code coverage.

## Table of contents

- [Testing and code coverage](#testing-and-code-coverage)
  - [Table of contents](#table-of-contents)
  - [How to run tests](#how-to-run-tests)
  - [Coverage Gutters (code coverage extension)](#coverage-gutters-code-coverage-extension)
  - [Why do we need code coverage?](#why-do-we-need-code-coverage)

## How to run tests

Thanks to `pipenv`, we can run tests by running this command:

```shell
pipenv run coverage; pipenv run report;
```

> [!NOTE]
> Windows users, you're going to need to run this command instead:
>
> `python -m pipenv run coverage; python -m pipenv run report;`

The `pipenv` scripts can be found in [the Pipfile](/Pipfile) under `[scripts]`.

`coverage` runs the tests, and `report` generates a XML report for the
Coverage Gutters extension to use.

## Coverage Gutters (code coverage extension)

One of the extensions that is recommended by this workspace is
[Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters).
It lets us view code coverage, similar to what we did in ICS 33.

After you run the commands, a `coverage.xml` file is generated. You can activate
Watch mode by selecting "Watch" from the bottom bar to get pretty colors!

| Color  | Meaning                                                          |
| ------ | ---------------------------------------------------------------- |
| Green  | It is covered.                                                   |
| Yellow | Partially covered. Check if all if statements cases are covered. |
| Red    | Not covered.                                                     |

![How to enable Watch mode with Coverage Gutters.](https://github.com/ryanluker/vscode-coverage-gutters/raw/HEAD/promo_images/coverage-gutters-features-1.gif)

## Why do we need code coverage?

If we want to make sure our code works, we need to run tests. If we want to make
sure our tests work, we need to check if our code is covered by the tests.

Code coverage gives us an idea of how much of our code is being tested.

**Please try to get as much code coverage as possible!**

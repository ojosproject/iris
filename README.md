# Iris for Desktop

This is the repository for [Iris](https://ojosproject.org/iris/), the all-in-one
caregiver tool.

## Installation

You can download the latest release of Iris
[on GitHub](https://github.com/ojosproject/iris/releases/latest/).

## Getting started

1. [Install pnpm](https://pnpm.io/installation)
   * Windows: `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression`
   * macOS/Linux: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
2. [Install Rust](https://www.rust-lang.org/tools/install)
3. [Install system dependencies](https://tauri.app/start/prerequisites/#system-dependencies)
4. [Install VSCode extensions](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_recommended-extensions)

### Clone the repository

```shell
git clone https://github.com/ojosproject/iris/
cd iris
```

### Run the program

> [!IMPORTANT]
> At least 5 GB of storage is recommended.

Please install the npm dependencies:

```shell
pnpm env use --global v22.16.0
pnpm i
```

... then run this to run the full program:

```shell
pnpm run dev
```

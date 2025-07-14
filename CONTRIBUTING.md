# Iris Contribution Guidelines

> [!NOTE]
> We're rewriting the contributing document. Some information may be missing,
> but this will help you get started quickly.

## Setting up your coding environment

Before you clone the repository, please:

1. [Install pnpm](https://pnpm.io/installation)
   * Windows: `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression`
   * macOS/Linux: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
2. [Install Rust](https://www.rust-lang.org/tools/install)
3. [Install system dependencies](https://tauri.app/start/prerequisites/#system-dependencies)
4. [Install VSCode extensions](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_recommended-extensions)

```shell
# Clone the repository with HTTPS (or SSH)
git clone https://github.com/ojosproject/iris/
cd iris
```

### Run the program

Please install the npm dependencies:

```shell
pnpm env use --global v22.16.0
pnpm i
```

... then run this to run the full program:

```shell
pnpm run dev
```

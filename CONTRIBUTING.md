# Iris Contribution Guidelines

> [!NOTE]
> We're rewriting the contributing document. Some information may be missing,
> but this will help you get started quickly.

![Ojos Project header](https://ojosproject.org/images/iris-v0-summary.png)

## Setting up your coding environment

Before you clone the repository, please:

1. [Install NodeJS using nvm](https://github.com/nvm-sh/nvm) or an equivalent tool
2. [Install Rust](https://www.rust-lang.org/tools/install)
3. [Install system dependencies](https://tauri.app/start/prerequisites/#system-dependencies)
4. [Install VSCode extensions](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_recommended-extensions)

```shell
# Clone the repository with SSH (or HTTPS)
git clone git@github.com:ojosproject/iris.git
cd iris
```

### Run the program

Please install the npm dependencies:

```shell
nvm use
npm i
```

... then run this to run the full program:

```shell
npm run dev
```

## Clearing Iris Data

When developing, you may want to clear the data produced by Iris to get a fresh
experience. To do so, you should run the following commands on the terminal:

* **Windows**: `rm -r -fo ~/AppData/Roaming/org.ojosproject.Iris`
* **macOS**: `rm -fr ~/Library/'Application Support'/org.ojosproject.Iris`
* **Linux**: `rm -fr ~/.local/share/org.ojosproject.Iris; rm -fr ~/.config/org.ojosproject.Iris`

---
icon: tools
---

# Dev Tools

## Gitify

## Linting & Formatting

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to handle the TS/JS code and [rustfmt](https://github.com/rust-lang/rustfmt#rustfmt----) for Rust. With the exception of a few files and directories, all of the code within the Firefly repository is run through a linting process to ensure cleanliness and consistency in terms of format, style, syntax, and more. This process happens both locally in a pre-commit Git hook (via [Husky](https://github.com/typicode/husky#husky)) as well as in a continuous integration workflow (see [`ci.lint.yml`](https://github.com/iotaledger/firefly/blob/develop/.github/workflows/ci.lint.yml)).

### TS/JS

All of the formatting and linting commands can be run from the root directory.

With formatting there are two options to either overwrite files with fixes or just simply check them for correctness:

```bash
# 1 - fix and overwrite files
yarn format

# 2 - check files 
yarn format-check
```

For linting there are three options to either check the files, check the files in debug mode, or fix and overwrite the files:

```bash
# 1 - check files
yarn lint

# 2 - check files in debug mode
yarn lint-debug

# 3 - fix and overwrite files
yarn lint-fix
```

:information_source: Svelte component files (`*.svelte`) are checked in addition to regular `*.ts` source code files.

## Retype Documentation

Retype makes it incredibly easy to manage documentation. Simply use the following command from the root directory:
```bash
# generates locally hosted instance of the handbook
yarn docs:start
```

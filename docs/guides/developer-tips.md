---
icon: light-bulb
---

# Developer Tips

Welcome to the Firefly developer tips! Here you will find all sorts of helpful information for general things across the codebase.

## Building and Running

### Backend

It is likely that you **will NOT** have to re-compile the backend (NodeJS _or_ Capacitor) bindings, unless you have either changed or modified specific "bridge" functions (like [this one](https://github.com/iotaledger/firefly/blob/develop/packages/shared/lib/typings/account.ts#L66)).

### Desktop

#### Svelte Components

If simply making changes to Svelte component files, it is not usually required to fully refresh the development instance (it is typically refreshed for you).

In some cases, the changes can cause unrecoverable errors unless you refresh via the developer console. This usually happens when changing imports or adding a new Svelte file.

#### TypeScript Library

If making changes within the TypeScript library files, it is usually necessary to refresh the development instance via the console so load the changes.

If editing files that are imported within `packages/desktop`, then it will be necessary to fully rebuild and restart the development instance. In particular, the following files require rebuilding:

-   `shared/lib/core/shell/*.ts`
-   `shared/lib/core/validation/*.ts`


## Common Processes

### Adding an icon

To add a new (SVG-based) icon for use in the application, simply create a new object entry [here](https://github.com/iotaledger/firefly/blob/develop/packages/shared/components/icon/icons.js#L1).

Most entries here simply include `width`, `height`, and `path` properties, however please be sure that whatever icon you are adding contains all of the necessary SVG data to be displayed correctly (e.g. `fillRule`s, `clipRule`s, `strokeWidth`).

If the icon is still not displaying properly, it is likely that it was either exported incorrectly or can be flattened in the design software **before** being exported.

### Adding a setting

There are a few steps to add a settings component to the Settings menu in Firefly:

-   Add your component to the correct folder under `packages/shared/routes/dashboard/settings/views`
-   Add an `export` statement to the barrel import/export file in the directory of your new component
-   Add your component to the `settings` of the file with the same name as the settings (e.g. `Advance.svelte` for the advanced setting)
-   Add your route enum to the appropriate settings route in `packages/shared/lib/core/router/enums/routes.ts`
-   Add the correct `title` and additional texts to the `view` property in `packages/shared/locales/en.json` for the translations.
-   Add an appropriate icon to`packages/shared/lib/typings/icons.ts`

### Adding a Svelte page

There are a few steps besides just creating the component file before it can work in Firefly:

-   Add an `export` statement to the barrel import/export file in the directory of your new component
-   Add the correct route value to the appropriate `enum` in `packages/shared/lib/typings/routes.ts`
-   Add the correct HTML (`Route` nested with `<Page>` element) in `packages/desktop/App.svelte`
-   Change logic as needed in `routerNext` in `packages/shared/lib/router.ts`

### Exposing an API endpoint

`wallet.rs` has an actor interface, which makes it easy to call functions via messages. To expose a new function one needs to add it to the `MessageType` and `ResponseType` enums in `wallet.rs/src/actor/message.rs` and to the `handle` method inside of `impl WalletMessageHandler {` in `wallet.rs/src/actor/mod.rs`. An example can be seen in this [commit](https://github.com/iotaledger/wallet.rs/commit/6de213583b2811cc4379a7698bc0812201228bd1#).

## Troubleshooting

### Dependencies

#### Backend

Firefly uses [wallet.rs](https://github.com/iotaledger/wallet.rs) in the backend to handle functionality around value-based transfers.
See its [README](https://github.com/iotaledger/wallet.rs#dependencies) for the required dependencies.

Log files are often required to debug `wallet.rs` issues. They can be found in the following folders:

-   Windows: `%APPDATA%\Roaming\Firefly\logs`
-   MacOS: `$HOME/Library/Application\ Support/Firefly/logs`
-   Linux: `~/.config/Firefly/logs`

For developer/alpha/beta builds you have to look for `Electron`/`'Firefly - Alpha'`/`'Firefly - Beta'` respectively.

#### Desktop

There may be times when Firefly just won't seem to compile correctly or you're getting an uncommon error while using it. If you get a blank electron application, reloading the electron application (MacOS: `Cmd+R`, Linux/Windows: `Ctrl+R`) might solve your issue. Another approach is updating the yarn dependencies:

```bash
# in root dir
yarn
```

### Memory Usage

When developing on Firefly, it is possible that your heap runs out of memory. This has to do with the heap space nodeJS allocates (on Linux this is 2048MB). Setting the heap space to 4096MB fixes this issue. Add the following line to your `~/.bashrc` file: `export NODE_OPTIONS=--max_old_space_size=4096`.

### `wallet.rs`

To debug what's going on in the backend you can add

```JS
Wallet.initLogger({
    color_enabled: true,
    name: 'wallet.log',
    level_filter: 'debug'
})
```

in `desktop/electron/preload.js` after `const Wallet = binding`. Debug logs will then be added to the `wallet.log` file in the same location where Firefly or the Electron / Capacitor development instance is installed.

## Resetting Firefly

### Desktop

If you want to reset Firefly your profiles are stored in the following places on the different OS'es for the official release:

-   Windows: `%APPDATA%\Roaming\Firefly\__storage__/`
-   MacOS: `$HOME/Library/Application\ Support/Firefly/__storage__/`
-   Linux: `~/.config/Firefly/__storage__/`

For developer/alpha/beta builds you have to look for `Electron`/`'Firefly - Alpha'`/`'Firefly - Beta'` respectively.

# Firefly - Desktop

Be sure to follow the base environment setup [here](./index.md)!

## Build

Install yarn dependencies:

```bash
# in the root directory
yarn

# in packages/backend/bindings/node
yarn
```

Build the desktop app:

```bash
# in packages/desktop
yarn build
```

## Development

Start the development server:

```bash
# in packages/desktop
yarn start
```

## Production

Change `<platform>` as necessary (`win`, `mac`, and `linux`):

```bash
# in packages/desktop
yarn compile:<platform>
```

MacOS users __must__ set an environment variable in order to skip notarization:

```bash
# in packages/desktop
export MACOS_SKIP_NOTARIZATION=true && yarn compile:mac
```

If Sentry bug reporting needs to be enabled for a local production build, you must modify the `packages.json` file within `packages/desktop/`:

```
{
    ...
    "scripts": {
        ...
        "build:prod": "cross-env NODE_ENV=production SENTRY=true webpack",
        ...                                          ^^^ add this environment variable declaration
    },
    ....
}
```

### Firefly Snap

To run the Firefly snap properly on Linux, you may need to run the following commands:

```bash
# install the snap when built locally
snap install --dangerous path/to/firefly-desktop-0.0.1.snap

# connect the password-manager-service interface
snap connect firefly-wallet:password-manager-service
```

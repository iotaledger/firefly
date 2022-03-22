---
icon: device-mobile
---

# Mobile
Be sure to follow the base environment setup [here](./index.md)!

## Build
Install yarn dependencies:
```bash
# in the root directory
yarn
```

Build the mobile app:
```bash
# in packages/mobile
yarn build
```

## Development
Start the development server:
```bash
# in packages/mobile
yarn dev
```

In a new terminal (while the development server is running):
```bash
# in packages/mobile
cp capacitor-sample.config.ts capacitor.config.ts
```

Modify the URL field in the newly copied file, replacing `XXX.XXX.XXX.XXX` with your local IP (will likely start with `192.168.1.XXX`):
```typescript
const config: CapacitorConfig = {
    ...
    server: {
        url: 'http://XXX.XXX.XXX.XXX:8080',
        cleartext: true,
    },
    ...
}
```

Run a mobile platform simulator:
```bash
# iOS
yarn ios:update

# Android
yarn android:update
```

# IOTA Firefly Mobile Wallet

This is the repository for the IOTA Firefly Mobile Wallet.

### Dev Mode

```
# in packages/mobile
yarn
yarn build

yarn android:update
yarn ios:update
```

## Capacitor Live Reload setup

Live Reload is useful for debugging both the web portion of an app as well as native functionality on device hardware or simulators. Rather than deploy a new native binary every time you make a code change, it reloads the browser (or Web View) when changes in the app are detected.

- https://capacitorjs.com/docs/guides/live-reload

Within `capacitor.config.json`, modify the url field using the local web server’s IP address replacing XXX.XXX.XXX.XXX with your local IP:

```json
"server": {
  "url": "http://XXX.XXX.XXX.XXX:8080",
  "cleartext": true
},
```

Next, run `npx cap copy` to copy the updated Capacitor config into all native projects.

Open the native IDE if it’s not already open:
```bash
npx cap open ios
npx cap open android
```

Finally, click the Run button to launch the app and start using Live Reload.

Remember run `yarn dev` to launch the development server.

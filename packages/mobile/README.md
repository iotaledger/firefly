# IOTA Firefly Mobile Wallet

This is the repository for the IOTA Firefly Mobile Wallet.

### Dev Mode

```bash
# in packages/mobile
yarn
yarn build
yarn dev

# Capacitor Live Reload setup
# keep development server running, then in a new terminal:
cp capacitor-sample.config.ts capacitor.config.ts 
# modify the url field "XXX.XXX.XXX.XXX" with your local IP

# update project files and open native IDE
yarn android:update
yarn ios:update
```

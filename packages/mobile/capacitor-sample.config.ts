import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.iota.wallet',
    appName: 'Firefly',
    webDir: 'public',
    bundledWebRuntime: false,
    plugins: {
        PrivacyScreen: {
            enable: true,
          },
    },
    server: {
        url: 'http://XXX.XXX.XXX.XXX:8080',
        cleartext: true,
    },
}

export default config

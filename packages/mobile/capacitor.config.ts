import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.iota.wallet',
    appName: 'Firefly',
    webDir: 'public',
    bundledWebRuntime: false,
    plugins: {},
    server: {
        url: 'http://192.168.1.175:8080',
        cleartext: true,
    },
}

export default config

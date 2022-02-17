import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'org.iota.firefly',
    appName: 'Firefly',
    webDir: 'public',
    bundledWebRuntime: false,
    plugins: {},
    server: {
        url: 'http://XXX.XXX.XXX.XXX:8080',
        cleartext: true,
    },
}

export default config

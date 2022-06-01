import { CapacitorConfig } from '@capacitor/cli'

const prod = process.env.NODE_ENV === 'production'
const ip = process.env.IP || 'localhost'

const serverConfig = {
    url: `http://${ip}:8080`,
    cleartext: true,
}

const config: CapacitorConfig = {
    appId: 'org.iota.firefly.mobile.alpha',
    appName: 'Firefly',
    webDir: 'public',
    bundledWebRuntime: false,
    plugins: {
        PrivacyScreen: {
            enable: false,
        },
        SplashScreen: {
            launchAutoHide: false,
            backgroundColor: '#ffffffff',
        },
    },
    server: prod ? undefined : serverConfig,
    cordova: {
        preferences: {
            DisableDeploy: 'true',
        },
    },
}

export default config

import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'org.iota.firefly.mobile',
    appName: 'Firefly',
    webDir: 'public',
    bundledWebRuntime: false,
    plugins: {
        PrivacyScreen: {
            enable: true,
        },
        SplashScreen: {
            launchAutoHide: false,
            backgroundColor: '#ffffffff',
        },
    },
    server: {
        url: 'http://XXX.XXX.XXX.XXX:8080',
        cleartext: true,
    },
    cordova: {
        preferences: {
            DisableDeploy: 'true',
        },
    },
}

export default config

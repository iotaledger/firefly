import { CapacitorConfig } from '@capacitor/cli'

const prod = process.env.NODE_ENV === 'production'
const ip = process.env.CAP_IP || 'localhost'

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
    loggingBehavior: prod ? 'none' : 'debug',
}

export default config

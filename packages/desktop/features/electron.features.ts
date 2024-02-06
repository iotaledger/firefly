import { IElectronFeatures } from './interfaces'

const electronFeatures: IElectronFeatures = {
    developerTools: {
        enabled: false,
    },
    autoUpdate: {
        enabled: true,
        win32: {
            enabled: true,
        },
        linux: {
            enabled: true,
        },
        darwin: {
            enabled: true,
        },
    },
}

export default electronFeatures

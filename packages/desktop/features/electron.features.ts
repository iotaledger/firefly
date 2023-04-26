import { IElectronFeatures } from './interfaces'

const electronFeatures: IElectronFeatures = {
    developerTools: {
        enabled: true,
    },
    autoUpdate: {
        enabled: true,
        win32: {
            enabled: false,
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

import type { IFeatureFlag } from '@lib/features/interfaces'

export interface IElectronFeatures {
    developerTools: IFeatureFlag
    autoUpdate: IFeatureFlag & {
        win32: IFeatureFlag
        linux: IFeatureFlag
        darwin: IFeatureFlag
    }
}

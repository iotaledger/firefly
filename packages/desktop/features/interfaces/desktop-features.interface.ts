import { IFeatures } from '@lib/features/interfaces'
import { IElectronFeatures } from './electron-features.interface'
import { IAnalyticsFeatures } from './analytics-features.interface'

export interface IDesktopFeatures extends IFeatures {
    electron: IElectronFeatures
    analytics: IAnalyticsFeatures
}

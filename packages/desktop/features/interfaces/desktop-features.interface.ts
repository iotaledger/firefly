import type { IFeatures } from '@lib/features/interfaces'
import type { IElectronFeatures } from './electron-features.interface'
import type { IAnalyticsFeatures } from './analytics-features.interface'

export interface IDesktopFeatures extends IFeatures {
    electron: IElectronFeatures
    analytics: IAnalyticsFeatures
}

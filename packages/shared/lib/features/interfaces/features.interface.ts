import { IFeatureFlag } from './feature-flag.interface'
import { OnboardingFeatures } from './onboarding-features.interface'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'

export interface IFeatures {
    onboarding: OnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    collectibles: unknown & IFeatureFlag
    governance: unknown & IFeatureFlag
    developerTools: unknown & IFeatureFlag
    electron?: unknown
}

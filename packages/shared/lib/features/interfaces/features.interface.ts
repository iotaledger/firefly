import { ICollectiblesFeatures } from './collectibles-features.interface'
import { IDeveloperFeatures } from './developer-features.interface'
import { IGovernanceFeatures } from './governance-features.interface'
import { IOnboardingFeatures } from './onboarding-features.interface'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'

export interface IFeatures {
    onboarding: IOnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    collectibles: ICollectiblesFeatures
    governance: IGovernanceFeatures
    developerTools: IDeveloperFeatures
}

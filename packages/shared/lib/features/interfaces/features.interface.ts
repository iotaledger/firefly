import { ICollectiblesFeatures } from './collectibles-features.interface'
import { IDeveloperFeatures } from './developer-features.interface'
import { IGovernanceFeatures } from './governance-features.interface'
import { OnboardingFeatures } from '../types/onboarding-features.type'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'

export interface IFeatures {
    onboarding: OnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    collectibles: ICollectiblesFeatures
    governance: IGovernanceFeatures
    developerTools: IDeveloperFeatures
}

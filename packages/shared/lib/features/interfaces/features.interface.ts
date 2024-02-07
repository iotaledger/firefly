import { ICollectiblesFeatures } from './collectibles-features.interface'
import { IDeveloperFeatures } from './developer-features.interface'
import { IGovernanceFeatures } from './governance-features.interface'
import { INetworkFeatures } from './network-features.interface'
import { OnboardingFeatures } from '../types/onboarding-features.type'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'
import { IVestingFeatures } from './vesting-features.interface'
import { IDelegationFeatures } from './delegation-features.interface'

export interface IFeatures {
    collectibles: ICollectiblesFeatures
    developerTools: IDeveloperFeatures
    network: INetworkFeatures
    governance: IGovernanceFeatures
    onboarding: OnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    vesting: IVestingFeatures
    delegation: IDelegationFeatures
}

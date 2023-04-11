import { IFeatureFlag } from './feature-flag.interface'
import { OnboardingFeatures } from './onboarding-features.interface'

export interface IFeatures {
    onboarding: OnboardingFeatures
    settings: unknown & IFeatureFlag
    wallet: unknown & IFeatureFlag
    collectibles: unknown & IFeatureFlag
    governance: unknown & IFeatureFlag
    developerTools: unknown & IFeatureFlag
    electron?: unknown
}

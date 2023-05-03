import { IPersistedProfile } from '@core/profile'
import { CreateProfileType, OnboardingType, ProfileProtectionType, RestoreProfileType } from '../enums'
import { ImportFile, Mnemonic } from '../types'
import { IShimmerClaimingAccount } from './shimmer-claiming-account.interface'

export interface IOnboardingProfile extends IPersistedProfile {
    // Onboarding flow indicators
    onboardingType?: OnboardingType
    createProfileType?: CreateProfileType
    restoreProfileType?: RestoreProfileType

    // Stronghold setup data
    importFile?: ImportFile
    importFilePath?: string

    // Mnemonic setup data
    mnemonic?: Mnemonic
    hasVerifiedMnemonic?: boolean
    hasStoredMnemonic?: boolean

    // Encryption password
    strongholdPassword?: string

    // Shimmer claiming data
    shimmerClaimingAccounts?: IShimmerClaimingAccount[]

    hasInitialisedProfileManager?: boolean

    // Mobile specific after refactor
    protectionType?: ProfileProtectionType
    mustVisitProfileName?: boolean
}

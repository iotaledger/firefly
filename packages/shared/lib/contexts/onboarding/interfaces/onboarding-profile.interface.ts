import { IPersistedProfile } from '@core/profile'

import {
    CreateProfileType,
    OnboardingType,
    ProfileProtectionType,
    ProfileRecoveryType,
    ProfileSetupType,
    RestoreProfileType,
} from '../enums'
import { ImportFile, Mnemonic } from '../types'

import { IShimmerClaimingAccount } from './shimmer-claiming-account.interface'

export interface IOnboardingProfile extends IPersistedProfile {
    onboardingType?: OnboardingType
    createProfileType?: CreateProfileType
    restoreProfileType?: RestoreProfileType
    setupType: ProfileSetupType
    recoveryType?: ProfileRecoveryType
    protectionType?: ProfileProtectionType
    importFile?: ImportFile
    importFilePath?: string
    mnemonic?: Mnemonic
    strongholdPassword?: string
    mustVisitProfileName?: boolean
    hasStoredMnemonic?: boolean
    hasInitialisedProfileManager?: boolean
    shimmerClaimingAccounts?: IShimmerClaimingAccount[]
}

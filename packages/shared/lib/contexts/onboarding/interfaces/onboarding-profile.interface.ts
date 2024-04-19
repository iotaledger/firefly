import { IPersistedProfile } from '@core/profile'
import { CreateProfileType, OnboardingType, RestoreProfileType } from '../enums'
import { ImportFile, Mnemonic } from '../types'
import { IShimmerClaimingWallet } from './shimmer-claiming-account.interface'

export interface IOnboardingProfile extends Omit<Partial<IPersistedProfile>, 'id'> {
    id: string

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
    shimmerClaimingAccounts?: IShimmerClaimingWallet[]
}

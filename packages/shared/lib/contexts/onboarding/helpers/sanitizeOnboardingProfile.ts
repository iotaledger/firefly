import { IOnboardingProfile } from '../interfaces'

export function sanitizeOnboardingProfile(onboardingProfile: Partial<IOnboardingProfile>): Partial<IOnboardingProfile> {
    if (!onboardingProfile) {
        return undefined
    }

    delete onboardingProfile?.importFilePath
    delete onboardingProfile?.mnemonic
    delete onboardingProfile?.strongholdPassword

    return onboardingProfile
}

import { get, writable } from 'svelte/store'

import { profiles, ProfileType } from '@core/profile'
import { onboardingProfile, ProfileRecoveryType, ProfileSetupType } from '@contexts/onboarding'

import { appRouter } from './app-router'
import { OnboardingRoute, ProfileBackupRoute, ProfileSetupRoute } from './enums'
import { Router } from './router'
import { profileBackupRoute, profileSetupRoute } from './subrouters'

export const onboardingRoute = writable<OnboardingRoute>(null)
export const onboardingRouter = writable<OnboardingRouter>(null)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(hasCompletedOnboardingBefore() ? OnboardingRoute.NetworkSetup : OnboardingRoute.AppSetup, onboardingRoute)
    }

    next(): void {
        let nextRoute: OnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.AppSetup:
                nextRoute = OnboardingRoute.NetworkSetup
                break
            case OnboardingRoute.NetworkSetup:
                nextRoute = OnboardingRoute.ProfileSetup
                break
            case OnboardingRoute.ProfileSetup: {
                const _onboardingProfile = get(onboardingProfile)
                const profileName = _onboardingProfile?.name
                if (profileName) {
                    const profileType = _onboardingProfile?.type
                    if (profileType === ProfileType.Software) {
                        const profileSetupType = _onboardingProfile?.setupType
                        if (profileSetupType === ProfileSetupType.New) {
                            nextRoute = OnboardingRoute.StrongholdSetup
                        } else {
                            const profileRecoveryType = _onboardingProfile?.recoveryType
                            if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
                                nextRoute = OnboardingRoute.StorageProtectionSetup
                            } else {
                                nextRoute = OnboardingRoute.StrongholdSetup
                            }
                        }
                    } else {
                        nextRoute = OnboardingRoute.StorageProtectionSetup
                    }
                } else {
                    nextRoute = OnboardingRoute.ProfileRecovery
                }
                break
            }
            case OnboardingRoute.StorageProtectionSetup: {
                const _onboardingProfile = get(onboardingProfile)
                const profileType = _onboardingProfile?.type
                if (profileType === ProfileType.Ledger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                } else {
                    const profileSetupType = _onboardingProfile?.setupType
                    if (profileSetupType === ProfileSetupType.Claimed) {
                        nextRoute = OnboardingRoute.ShimmerClaiming
                    } else if (profileSetupType === ProfileSetupType.New) {
                        nextRoute = OnboardingRoute.ProfileBackup
                    } else {
                        const profileRecoveryType = _onboardingProfile?.recoveryType
                        if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
                            nextRoute = OnboardingRoute.Congratulations
                        } else {
                            profileBackupRoute.set(ProfileBackupRoute.BackupStronghold)
                            nextRoute = OnboardingRoute.ProfileBackup
                        }
                    }
                }
                break
            }
            case OnboardingRoute.ProfileRecovery: {
                const profileRecoveryType = get(onboardingProfile)?.recoveryType
                if (
                    profileRecoveryType === ProfileRecoveryType.Mnemonic ||
                    profileRecoveryType === ProfileRecoveryType.Stronghold
                ) {
                    profileSetupRoute.set(ProfileSetupRoute.EnterName)
                    nextRoute = OnboardingRoute.ProfileSetup
                }
                break
            }

            case OnboardingRoute.StrongholdSetup: {
                nextRoute = OnboardingRoute.StorageProtectionSetup
                break
            }
            case OnboardingRoute.ProfileBackup: {
                nextRoute = OnboardingRoute.Congratulations
                break
            }
            case OnboardingRoute.LedgerSetup: {
                const profileSetupType = get(onboardingProfile)?.setupType
                if (profileSetupType === ProfileSetupType.Claimed) {
                    nextRoute = OnboardingRoute.ShimmerClaiming
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            case OnboardingRoute.ShimmerClaiming:
                nextRoute = OnboardingRoute.Congratulations
                break
            case OnboardingRoute.Congratulations:
                get(appRouter).next()
                return
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            get(appRouter).previous()
        }
    }
}

function hasCompletedOnboardingBefore(): boolean {
    return get(profiles).length > 0
}

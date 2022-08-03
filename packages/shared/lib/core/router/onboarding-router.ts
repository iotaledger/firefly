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
    hasCompletedRecovery: boolean = false

    constructor() {
        super(hasCompletedOnboardingBefore() ? OnboardingRoute.NetworkSetup : OnboardingRoute.Welcome, onboardingRoute)
    }

    next(): void {
        let nextRoute: OnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.Welcome:
                nextRoute = OnboardingRoute.AppSetup
                break
            case OnboardingRoute.AppSetup:
                nextRoute = OnboardingRoute.NetworkSetup
                break
            case OnboardingRoute.NetworkSetup:
                nextRoute = OnboardingRoute.ProfileSetup
                break
            case OnboardingRoute.ProfileSetup: {
                const profileName = get(onboardingProfile)?.name
                if (profileName) {
                    const profileType = get(onboardingProfile)?.type
                    if (profileType === ProfileType.Software) {
                        nextRoute = OnboardingRoute.StrongholdSetup
                    } else {
                        nextRoute = OnboardingRoute.StorageProtection
                    }
                } else {
                    nextRoute = OnboardingRoute.ProfileRecovery
                }
                break
            }
            case OnboardingRoute.StorageProtection: {
                const _onboardingProfile = get(onboardingProfile)
                const profileType = _onboardingProfile?.type
                const profileSetupType = _onboardingProfile?.setupType
                const profileRecoveryType = _onboardingProfile?.recoveryType
                if (profileType === ProfileType.Ledger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                } else {
                    if (profileSetupType === ProfileSetupType.Claimed) {
                        nextRoute = OnboardingRoute.ShimmerClaiming
                    } else if (profileSetupType === ProfileSetupType.New) {
                        nextRoute = OnboardingRoute.ProfileBackup
                    } else {
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
                    this.hasCompletedRecovery = true
                    profileSetupRoute.set(ProfileSetupRoute.EnterName)
                    nextRoute = OnboardingRoute.ProfileSetup
                }
                break
            }

            case OnboardingRoute.StrongholdSetup: {
                nextRoute = OnboardingRoute.StorageProtection
                break
            }
            case OnboardingRoute.ProfileBackup: {
                const profileRecoveryType = get(onboardingProfile)?.recoveryType
                if (
                    profileRecoveryType === ProfileRecoveryType.Seed ||
                    profileRecoveryType === ProfileRecoveryType.SeedVault
                ) {
                    nextRoute = OnboardingRoute.Migration
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            // case OnboardingRoute.Balance:
            //     if (get(profileRecoveryType) === ProfileRecoveryType.TrinityLedger) {
            //         nextRoute = OnboardingRoute.Migration
            //     } else {
            //         nextRoute = OnboardingRoute.Password
            //     }
            //     break
            case OnboardingRoute.Migration:
                nextRoute = OnboardingRoute.Congratulations
                break
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

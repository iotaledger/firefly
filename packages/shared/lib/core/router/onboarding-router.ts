import { get, writable } from 'svelte/store'

import { profiles, ProfileType } from '@core/profile'
import {
    onboardingProfile,
    ProfileRecoveryType,
    profileRecoveryType,
    ProfileSetupType,
    profileSetupType,
    strongholdPassword,
} from '@contexts/onboarding'

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
                const profileType = get(onboardingProfile)?.type
                if (profileType) {
                    if (profileType === ProfileType.Software) {
                        nextRoute = OnboardingRoute.PasswordSetup
                    } else if (profileType === ProfileType.Ledger) {
                        nextRoute = OnboardingRoute.Protection
                    }
                }

                const _profileRecoveryType = get(profileRecoveryType)
                if (
                    !this.hasCompletedRecovery &&
                    (_profileRecoveryType === ProfileRecoveryType.Mnemonic ||
                        _profileRecoveryType === ProfileRecoveryType.Stronghold)
                ) {
                    nextRoute = OnboardingRoute.ProfileRecovery
                } else if (_profileRecoveryType === ProfileRecoveryType.FireflyLedger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                }
                break
            }
            case OnboardingRoute.Protection: {
                const _profileType = get(onboardingProfile)?.type
                if (_profileType === ProfileType.Software) {
                    nextRoute = OnboardingRoute.ProfileBackup
                } else if (_profileType === ProfileType.Ledger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                }

                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = OnboardingRoute.ProfileBackup
                    profileBackupRoute.set(ProfileBackupRoute.Backup)
                } else if (_profileRecoveryType === ProfileRecoveryType.Stronghold) {
                    nextRoute = OnboardingRoute.Congratulations
                }

                const _profileSetupType = get(profileSetupType)
                if (_profileSetupType === ProfileSetupType.Claimed) {
                    nextRoute = OnboardingRoute.ShimmerClaiming
                }
                break
            }
            case OnboardingRoute.ProfileRecovery: {
                const _profileRecoveryType = get(profileRecoveryType)
                if (
                    _profileRecoveryType === ProfileRecoveryType.Mnemonic ||
                    _profileRecoveryType === ProfileRecoveryType.Stronghold
                ) {
                    this.hasCompletedRecovery = true
                    profileSetupRoute.set(ProfileSetupRoute.EnterName)
                    nextRoute = OnboardingRoute.ProfileSetup
                }
                break
            }

            case OnboardingRoute.PasswordSetup: {
                if (get(strongholdPassword)) {
                    nextRoute = OnboardingRoute.Protection
                } else {
                    console.error('No Stronghold password was set.')
                }
                break
            }
            case OnboardingRoute.ProfileBackup: {
                const setupType = get(profileRecoveryType)
                if (setupType === ProfileRecoveryType.Seed || setupType === ProfileRecoveryType.SeedVault) {
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
            case OnboardingRoute.LedgerSetup:
                if (get(profileRecoveryType) === ProfileRecoveryType.TrinityLedger) {
                    // nextRoute = OnboardingRoute.Balance
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
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

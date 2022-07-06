import { get, writable } from 'svelte/store'

import { profiles, ProfileType } from '@core/profile'
import { newProfile, ProfileRecoveryType, profileRecoveryType } from '@contexts/onboarding'

import { appRouter } from './app-router'
import { BackupRoute, OnboardingRoute, ProfileSetupRoute } from './enums'
import { Router } from './router'
import { backupRoute, profileSetupRoute } from './subrouters'
import { FireflyEvent } from './types'

export const onboardingRoute = writable<OnboardingRoute>(null)
export const onboardingRouter = writable<OnboardingRouter>(null)

export class OnboardingRouter extends Router<OnboardingRoute> {
    hasCompletedRecovery: boolean = false

    constructor() {
        super(hasCompletedOnboardingBefore() ? OnboardingRoute.Network : OnboardingRoute.Welcome, onboardingRoute)
    }

    next(event?: FireflyEvent): void {
        let nextRoute: OnboardingRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.Welcome:
                nextRoute = OnboardingRoute.AppSetup
                break
            case OnboardingRoute.AppSetup:
                nextRoute = OnboardingRoute.Network
                break
            case OnboardingRoute.Network:
                nextRoute = OnboardingRoute.ProfileSetup
                break
            case OnboardingRoute.ProfileSetup: {
                const profileType = get(newProfile)?.type
                if (profileType) {
                    if (profileType === ProfileType.Software) {
                        nextRoute = OnboardingRoute.Password
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
                    nextRoute = OnboardingRoute.Recovery
                } else if (_profileRecoveryType === ProfileRecoveryType.FireflyLedger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                }
                break
            }
            case OnboardingRoute.Secure:
                nextRoute = OnboardingRoute.Protection
                break
            case OnboardingRoute.Protection: {
                const _profileType = get(newProfile)?.type
                if (_profileType === ProfileType.Software) {
                    nextRoute = OnboardingRoute.Backup
                } else if (_profileType === ProfileType.Ledger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                }

                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = OnboardingRoute.Backup
                    backupRoute.set(BackupRoute.Backup)
                } else if (_profileRecoveryType === ProfileRecoveryType.Stronghold) {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            case OnboardingRoute.Recovery: {
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

            case OnboardingRoute.Password: {
                const { password } = params
                if (password) {
                    nextRoute = OnboardingRoute.Protection
                }
                break
            }
            case OnboardingRoute.Backup: {
                const setupType = get(profileRecoveryType)
                if (setupType === ProfileRecoveryType.Seed || setupType === ProfileRecoveryType.SeedVault) {
                    nextRoute = OnboardingRoute.Migration
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            case OnboardingRoute.Balance:
                if (get(profileRecoveryType) === ProfileRecoveryType.TrinityLedger) {
                    nextRoute = OnboardingRoute.Migration
                } else {
                    nextRoute = OnboardingRoute.Password
                }
                break
            case OnboardingRoute.Migration:
                nextRoute = OnboardingRoute.Congratulations
                break
            case OnboardingRoute.LedgerSetup:
                if (get(profileRecoveryType) === ProfileRecoveryType.TrinityLedger) {
                    nextRoute = OnboardingRoute.Balance
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
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

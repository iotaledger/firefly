import { get, writable } from 'svelte/store'

import { activeProfile, newProfile, profiles, ProfileType } from '@core/profile'
import { ProfileRecoveryType, profileRecoveryType } from '@contexts/onboarding'

import { appRouter } from './app-router'
import { OnboardingRoute } from './enums'
import { Router } from './router'
import { FireflyEvent } from './types'

export const onboardingRoute = writable<OnboardingRoute>(null)
export const onboardingRouter = writable<OnboardingRouter>(null)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(OnboardingRoute.Welcome, onboardingRoute)
        this.init()
    }

    public init(): void {
        const hasCompletedOnboardingBefore = get(profiles).length > 0
        this.routeStore.set(hasCompletedOnboardingBefore ? OnboardingRoute.Network : OnboardingRoute.Welcome)
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
                        nextRoute = OnboardingRoute.Secure
                    } else if (profileType === ProfileType.Ledger) {
                        nextRoute = OnboardingRoute.Protection
                    }
                }
                break
            }
            case OnboardingRoute.Secure:
                nextRoute = OnboardingRoute.Protection
                break
            case OnboardingRoute.Protection: {
                const profileType = get(activeProfile)?.type
                const setupType = get(profileRecoveryType)
                if (setupType === ProfileRecoveryType.Mnemonic || setupType === ProfileRecoveryType.Stronghold) {
                    nextRoute = OnboardingRoute.Congratulations
                } else if (profileType === ProfileType.Ledger || profileType === ProfileType.LedgerSimulator) {
                    nextRoute = OnboardingRoute.LedgerSetup
                } else {
                    nextRoute = OnboardingRoute.Backup
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
            case OnboardingRoute.Import: {
                const _profileRecoveryType = params?.profileRecoveryType
                profileRecoveryType.set(_profileRecoveryType)
                nextRoute = OnboardingRoute.Congratulations
                if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = OnboardingRoute.Secure
                } else if (
                    [
                        ProfileRecoveryType.Stronghold,
                        ProfileRecoveryType.TrinityLedger,
                        ProfileRecoveryType.FireflyLedger,
                    ].includes(_profileRecoveryType)
                ) {
                    nextRoute = OnboardingRoute.Protection
                } else if (
                    _profileRecoveryType === ProfileRecoveryType.Seed ||
                    _profileRecoveryType === ProfileRecoveryType.SeedVault
                ) {
                    nextRoute = OnboardingRoute.Balance
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
                break
        }

        this.setNext(nextRoute)
    }
}

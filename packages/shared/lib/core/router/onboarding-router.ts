import { get, writable } from 'svelte/store'

import { mobile } from '@core/app'
import { activeProfile, newProfile, ProfileImportType, profiles, ProfileType, setNewProfileType } from '@core/profile'
import { walletSetupType } from '@lib/wallet'
import { SetupType } from '@lib/typings/setup'

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
            case OnboardingRoute.Network: {
                nextRoute = OnboardingRoute.Setup
                break
            }
            case OnboardingRoute.Profile:
                nextRoute = OnboardingRoute.Setup
                break
            case OnboardingRoute.Setup: {
                const { setupType } = params
                if (setupType) {
                    walletSetupType.set(setupType)
                    if (setupType === SetupType.New) {
                        if (get(mobile)) {
                            setNewProfileType(ProfileType.Software)
                            nextRoute = OnboardingRoute.Secure
                        } else {
                            nextRoute = OnboardingRoute.Create
                        }
                    } else if (setupType === SetupType.Import) {
                        nextRoute = OnboardingRoute.Import
                    }
                }
                break
            }
            case OnboardingRoute.Create: {
                const profileType = get(newProfile)?.type
                if (profileType === ProfileType.Software) {
                    nextRoute = OnboardingRoute.Secure
                } else if (profileType === ProfileType.Ledger || profileType === ProfileType.LedgerSimulator) {
                    nextRoute = OnboardingRoute.Protect
                }
                break
            }
            case OnboardingRoute.Secure:
                nextRoute = OnboardingRoute.Password
                break
            case OnboardingRoute.Password: {
                const { password } = params
                if (password) {
                    nextRoute = OnboardingRoute.Protect
                }
                break
            }
            case OnboardingRoute.Protect: {
                const profileType = get(activeProfile)?.type
                const setupType = get(walletSetupType)
                if (setupType === SetupType.Mnemonic || setupType === SetupType.Stronghold) {
                    nextRoute = OnboardingRoute.Congratulations
                } else if (profileType === ProfileType.Ledger || profileType === ProfileType.LedgerSimulator) {
                    nextRoute = OnboardingRoute.LedgerSetup
                } else {
                    nextRoute = OnboardingRoute.Backup
                }
                break
            }
            case OnboardingRoute.Backup: {
                const setupType = get(walletSetupType)
                if (setupType === SetupType.Seed || setupType === SetupType.Seedvault) {
                    nextRoute = OnboardingRoute.Migrate
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            case OnboardingRoute.Import: {
                const { importType } = params
                walletSetupType.set(importType as unknown as SetupType)
                nextRoute = OnboardingRoute.Congratulations
                if (importType === ProfileImportType.Mnemonic) {
                    nextRoute = OnboardingRoute.Secure
                } else if (
                    [
                        ProfileImportType.Stronghold,
                        ProfileImportType.TrinityLedger,
                        ProfileImportType.FireflyLedger,
                    ].includes(importType)
                ) {
                    nextRoute = OnboardingRoute.Protect
                } else if (importType === ProfileImportType.Seed || importType === ProfileImportType.SeedVault) {
                    nextRoute = OnboardingRoute.Balance
                }
                break
            }
            case OnboardingRoute.Balance:
                if (get(walletSetupType) === SetupType.TrinityLedger) {
                    nextRoute = OnboardingRoute.Migrate
                } else {
                    nextRoute = OnboardingRoute.Password
                }
                break
            case OnboardingRoute.Migrate:
                nextRoute = OnboardingRoute.Congratulations
                break
            case OnboardingRoute.LedgerSetup:
                if (get(walletSetupType) === SetupType.TrinityLedger) {
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

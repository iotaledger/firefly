import { get, writable } from 'svelte/store'

import { cleanupSignup, login, mobile, strongholdPassword, walletPin } from '@lib/app'
import { activeProfile, profiles, setProfileType } from '@lib/profile'
import { isStrongholdOutdated } from '@lib/stronghold'
import { ImportType, ProfileType } from '@lib/typings/profile'
import { SetupType } from '@lib/typings/setup'
import { walletSetupType } from '@lib/wallet'

import { AppRoute } from './enums'
import { Router } from './router'
import { FireflyEvent } from './types'

export const appRoute = writable<AppRoute>(null)
export const appRouter = writable<AppRouter>(null)

export class AppRouter extends Router<AppRoute> {
    constructor() {
        super(AppRoute.Welcome, appRoute)
        this.init()
    }

    public init(): void {
        const hasCompletedSetup = get(profiles).length > 0

        if (hasCompletedSetup) {
            this.routeStore.set(AppRoute.Login)
        } else {
            this.routeStore.set(AppRoute.Welcome)
        }
    }

    public reset(): void {
        this.history = []
        this.init()
    }

    public next(event?: FireflyEvent): void {
        // TODO: only handle route changes, not app variables
        const params = event || {}
        const currentRoute = get(this.routeStore)
        let nextRoute: AppRoute

        switch (currentRoute) {
            case AppRoute.Login: {
                walletSetupType.set(null)
                if (params.shouldAddProfile) {
                    nextRoute = AppRoute.Profile
                } else {
                    const strongholdUpdateRequired =
                        get(activeProfile) &&
                        get(activeProfile).type === ProfileType.Software &&
                        isStrongholdOutdated(get(activeProfile))
                    if (strongholdUpdateRequired) {
                        nextRoute = AppRoute.UpdateStronghold
                    } else {
                        login()
                        nextRoute = AppRoute.Dashboard
                    }
                }
                break
            }
            case AppRoute.UpdateStronghold:
                strongholdPassword.set(undefined)
                // if we come from onboarding
                if (get(walletSetupType) === SetupType.Stronghold) {
                    nextRoute = AppRoute.Protect
                } else {
                    login()
                    nextRoute = AppRoute.Dashboard
                }
                break
            case AppRoute.Dashboard: {
                if (params.reset) {
                    nextRoute = AppRoute.Login
                }
                break
            }
            case AppRoute.Welcome:
                if (get(mobile)) {
                    nextRoute = AppRoute.Profile
                } else {
                    nextRoute = AppRoute.Legal
                }
                break
            case AppRoute.Legal:
                nextRoute = AppRoute.CrashReporting
                break
            case AppRoute.CrashReporting:
                nextRoute = AppRoute.Appearance
                break
            case AppRoute.Appearance:
                nextRoute = AppRoute.Profile
                break
            case AppRoute.Profile:
                nextRoute = AppRoute.Setup
                break
            case AppRoute.Setup: {
                const { setupType } = params
                if (setupType) {
                    walletSetupType.set(setupType)
                    if (setupType === SetupType.New) {
                        if (get(mobile)) {
                            setProfileType(ProfileType.Software)
                            nextRoute = AppRoute.Password
                        } else {
                            nextRoute = AppRoute.Create
                        }
                    } else if (setupType === SetupType.Import) {
                        nextRoute = AppRoute.Import
                    }
                }
                break
            }
            case AppRoute.Create: {
                const profileType = get(activeProfile)?.type
                if (profileType === ProfileType.Software) {
                    nextRoute = AppRoute.Secure
                } else if (profileType === ProfileType.Ledger || ProfileType.LedgerSimulator) {
                    nextRoute = AppRoute.Protect
                }
                break
            }
            case AppRoute.Secure:
                nextRoute = AppRoute.Password
                break
            case AppRoute.Password: {
                const { password } = params
                if (password) {
                    strongholdPassword.set(password)
                    nextRoute = AppRoute.Protect
                }
                break
            }
            case AppRoute.Protect: {
                const { pin } = params
                if (pin) {
                    walletPin.set(pin)
                    const profileType = get(activeProfile)?.type
                    if ([SetupType.Mnemonic, SetupType.Stronghold].includes(get(walletSetupType))) {
                        nextRoute = AppRoute.Congratulations
                    } else if ([ProfileType.Ledger, ProfileType.LedgerSimulator].includes(profileType)) {
                        nextRoute = AppRoute.LedgerSetup
                    } else {
                        nextRoute = AppRoute.Backup
                    }
                }
                break
            }
            case AppRoute.Backup:
                if (get(walletSetupType) === SetupType.Seed || get(walletSetupType) === SetupType.Seedvault) {
                    nextRoute = AppRoute.Migrate
                } else {
                    nextRoute = AppRoute.Congratulations
                }
                break
            case AppRoute.Import: {
                const { importType, strongholdUpdateRequired } = params
                walletSetupType.set(importType as unknown as SetupType)
                nextRoute = AppRoute.Congratulations
                if (importType === ImportType.Mnemonic) {
                    nextRoute = AppRoute.Secure
                } else if (importType === ImportType.Stronghold) {
                    if (strongholdUpdateRequired) {
                        nextRoute = AppRoute.UpdateStronghold
                    } else {
                        nextRoute = AppRoute.Password
                    }
                } else if ([ImportType.TrinityLedger, ImportType.FireflyLedger].includes(importType)) {
                    nextRoute = AppRoute.Protect
                } else if (importType === ImportType.Seed || importType === ImportType.SeedVault) {
                    nextRoute = AppRoute.Balance
                }
                break
            }
            case AppRoute.Balance:
                if (get(walletSetupType) === SetupType.TrinityLedger) {
                    nextRoute = AppRoute.Migrate
                } else {
                    nextRoute = AppRoute.Password
                }
                break
            case AppRoute.Migrate:
                nextRoute = AppRoute.Congratulations
                break
            case AppRoute.LedgerSetup:
                if (get(walletSetupType) === SetupType.TrinityLedger) {
                    nextRoute = AppRoute.Balance
                } else {
                    nextRoute = AppRoute.Congratulations
                }
                break
            case AppRoute.Congratulations:
                cleanupSignup()
                login()
                nextRoute = AppRoute.Dashboard
                break
        }
        this.setNext(nextRoute)
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}

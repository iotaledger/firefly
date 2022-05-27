import { activeProfile, newProfile, ProfileImportType, profiles, ProfileType, setNewProfileType } from '@core/profile'
import { mobile } from '@core/app'
import { cleanupSignup, strongholdPassword, walletPin } from '@lib/app'
import { SetupType } from '@lib/typings/setup'
import { get, writable } from 'svelte/store'
import { AppRoute } from './enums'
import { Router } from './router'
import { FireflyEvent } from './types'
import { NetworkType } from '@core/network'
import { walletSetupType } from '@lib/wallet'

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
                if (params.shouldAddProfile) {
                    nextRoute = AppRoute.Protocol
                } else {
                    nextRoute = AppRoute.Dashboard
                }
                break
            }
            case AppRoute.Dashboard: {
                if (params.reset) {
                    nextRoute = AppRoute.Login
                }
                break
            }
            case AppRoute.Welcome:
                nextRoute = AppRoute.Legal
                break
            case AppRoute.Legal:
                nextRoute = AppRoute.CrashReporting
                break
            case AppRoute.CrashReporting:
                nextRoute = AppRoute.Appearance
                break
            case AppRoute.Appearance:
                nextRoute = AppRoute.Protocol
                break
            case AppRoute.Protocol: {
                const isDeveloperProfile = get(newProfile)?.isDeveloperProfile
                if (isDeveloperProfile) {
                    nextRoute = AppRoute.Network
                } else {
                    nextRoute = AppRoute.Profile
                }
                break
            }
            case AppRoute.Network: {
                const networkType = event?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
                    nextRoute = AppRoute.CustomNetwork
                } else {
                    nextRoute = AppRoute.Profile
                }
                break
            }
            case AppRoute.CustomNetwork: {
                nextRoute = AppRoute.Profile
                break
            }
            case AppRoute.Profile:
                nextRoute = AppRoute.Setup
                break
            case AppRoute.Setup: {
                const { setupType } = params
                if (setupType) {
                    walletSetupType.set(setupType)
                    if (setupType === SetupType.New) {
                        if (get(mobile)) {
                            setNewProfileType(ProfileType.Software)
                            nextRoute = AppRoute.Secure
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
                const profileType = get(newProfile)?.type
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
                const { importType } = params
                walletSetupType.set(importType as unknown as SetupType)
                nextRoute = AppRoute.Congratulations
                if (importType === ProfileImportType.Mnemonic) {
                    nextRoute = AppRoute.Secure
                } else if (
                    [
                        ProfileImportType.Stronghold,
                        ProfileImportType.TrinityLedger,
                        ProfileImportType.FireflyLedger,
                    ].includes(importType)
                ) {
                    nextRoute = AppRoute.Protect
                } else if (importType === ProfileImportType.Seed || importType === ProfileImportType.SeedVault) {
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
                nextRoute = AppRoute.Dashboard
                break
        }
        this.setNext(nextRoute)
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}

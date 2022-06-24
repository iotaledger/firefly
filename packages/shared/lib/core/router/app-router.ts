import { get, writable } from 'svelte/store'

import { AppStage, appStage, mobile } from '@core/app'
import { NetworkType } from '@core/network'
import {
    activeProfile,
    newProfile,
    ProfileImportType,
    profiles,
    ProfileType,
    setNewProfileType,
    updateNewProfile,
} from '@core/profile'
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
                nextRoute = AppRoute.LanguageAndAppearance
                break
            case AppRoute.LanguageAndAppearance:
                if (get(appStage) !== AppStage.PROD) {
                    updateNewProfile({ isDeveloperProfile: true })
                }
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
                } else if (profileType === ProfileType.Ledger || profileType === ProfileType.LedgerSimulator) {
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
                    nextRoute = AppRoute.Protect
                }
                break
            }
            case AppRoute.Protect: {
                const profileType = get(activeProfile)?.type
                const setupType = get(walletSetupType)
                if (setupType === SetupType.Mnemonic || setupType === SetupType.Stronghold) {
                    nextRoute = AppRoute.Congratulations
                } else if (profileType === ProfileType.Ledger || profileType === ProfileType.LedgerSimulator) {
                    nextRoute = AppRoute.LedgerSetup
                } else {
                    nextRoute = AppRoute.Backup
                }
                break
            }
            case AppRoute.Backup: {
                const setupType = get(walletSetupType)
                if (setupType === SetupType.Seed || setupType === SetupType.Seedvault) {
                    nextRoute = AppRoute.Migrate
                } else {
                    nextRoute = AppRoute.Congratulations
                }
                break
            }
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
                nextRoute = AppRoute.Dashboard
                break
        }
        this.setNext(nextRoute)
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}

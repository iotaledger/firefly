import { get, writable } from 'svelte/store'

import { ProfileRecoveryType } from '@contexts/onboarding/enums'
import { onboardingProfile } from '@contexts/onboarding/stores'

import { isStrongholdUpdated } from '../../../app/utils'
import { Subrouter } from '../../classes'
import { ProfileRecoveryRoute } from '../../enums'
import { onboardingRouter } from '../../routers'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '../update-stronghold-router'

export const profileRecoveryRoute = writable<ProfileRecoveryRoute>(null)
export const profileRecoveryRouter = writable<ProfileRecoveryRouter>(null)

export class ProfileRecoveryRouter extends Subrouter<ProfileRecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(
            getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase,
            profileRecoveryRoute,
            get(onboardingRouter)
        )
    }

    resetRoute(): void {
        profileRecoveryRoute.set(getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase)
    }

    next(): void {
        let nextRoute: ProfileRecoveryRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileRecoveryRoute.ImportMnemonicPhrase: {
                const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = ProfileRecoveryRoute.Success
                }
                break
            }
            case ProfileRecoveryRoute.ImportStrongholdBackup: {
                const requiresUpdate = !isStrongholdUpdated(get(onboardingProfile)?.strongholdVersion)

                if (requiresUpdate) {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))

                    nextRoute = ProfileRecoveryRoute.UpdateStronghold
                } else {
                    nextRoute = ProfileRecoveryRoute.BackupPassword
                }
                break
            }
            case ProfileRecoveryRoute.BackupPassword: {
                nextRoute = ProfileRecoveryRoute.Success
                break
            }
            case ProfileRecoveryRoute.UpdateStronghold: {
                nextRoute = ProfileRecoveryRoute.Success
                break
            }
            case ProfileRecoveryRoute.LedgerImport: {
                // const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                // this.parentRouter.next()
                break
            }
            case ProfileRecoveryRoute.Success:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): ProfileRecoveryRoute {
    switch (get(onboardingProfile)?.recoveryType) {
        case ProfileRecoveryType.Mnemonic:
            return ProfileRecoveryRoute.ImportMnemonicPhrase
        case ProfileRecoveryType.Stronghold:
            return ProfileRecoveryRoute.ImportStrongholdBackup
        case ProfileRecoveryType.Ledger:
            return ProfileRecoveryRoute.LedgerImport
    }
}

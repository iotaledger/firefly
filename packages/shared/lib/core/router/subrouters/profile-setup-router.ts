import { get, writable } from 'svelte/store'

import { profileRecoveryType, ProfileRecoveryType, profileSetupType, ProfileSetupType } from '@contexts/onboarding'

import { ProfileSetupRoute } from '../enums'
import { onboardingRouter } from '../onboarding-router'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const profileSetupRoute = writable<ProfileSetupRoute>(null)
export const profileSetupRouter = writable<ProfileSetupRouter>(null)

export class ProfileSetupRouter extends Subrouter<ProfileSetupRoute> {
    constructor() {
        super(ProfileSetupRoute.Setup, profileSetupRoute)
    }

    next(event?: FireflyEvent): void {
        let nextRoute: ProfileSetupRoute

        const params = event || {}
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileSetupRoute.Setup: {
                const _profileSetupType = params?.profileSetupType
                if (_profileSetupType) {
                    profileSetupType.set(_profileSetupType)
                    if (_profileSetupType === ProfileSetupType.Claimed) {
                        nextRoute = ProfileSetupRoute.SetupClaimed
                    } else if (_profileSetupType === ProfileSetupType.New) {
                        nextRoute = ProfileSetupRoute.SetupNew
                    } else if (_profileSetupType === ProfileSetupType.Restored) {
                        nextRoute = ProfileSetupRoute.SetupRestored
                    }
                }
                break
            }
            case ProfileSetupRoute.SetupClaimed:
            case ProfileSetupRoute.SetupRestored: {
                const _profileRecoveryType = params?.profileRecoveryType
                if (_profileRecoveryType) {
                    profileRecoveryType.set(_profileRecoveryType)
                    if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                        // go to import mnemonic
                    } else if (_profileRecoveryType === ProfileRecoveryType.Stronghold) {
                        // go to import stronghold
                    } else if (_profileRecoveryType === ProfileRecoveryType.Ledger) {
                        nextRoute = ProfileSetupRoute.EnterName
                    }
                }
                break
            }
            case ProfileSetupRoute.SetupNew:
                nextRoute = ProfileSetupRoute.EnterName
                break
            case ProfileSetupRoute.EnterName: {
                get(onboardingRouter).next()
                break
            }
        }

        this.setNext(nextRoute)
    }
}

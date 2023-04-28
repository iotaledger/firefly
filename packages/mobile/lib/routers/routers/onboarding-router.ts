import { get, writable } from 'svelte/store'

import {
    onboardingProfile,
    RestoreProfileType,
    shouldBeDeveloperProfile,
    updateOnboardingProfile,
    OnboardingType,
} from '@contexts/onboarding'

import { hasCompletedAppSetup } from '@core/app'
import { ProfileType } from '@core/profile'
import { Router } from '@core/router'

import { appRouter } from './app-router'
import { OnboardingRoute, ProfileSetupRoute } from '../enums'
import { profileRecoveryRouter, profileSetupRoute } from '.'

export const onboardingRoute = writable<OnboardingRoute>(null)
export const onboardingRouter = writable<OnboardingRouter>(null)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(getInitialRoute(), onboardingRoute)
    }

    resetRecovery(): void {
        updateOnboardingProfile({ type: null, restoreProfileType: null })
        this.filterHistory(OnboardingRoute.ProfileRecovery)
        get(profileRecoveryRouter).reset()
        const onboardingType = get(onboardingProfile)?.onboardingType
        if (onboardingType === OnboardingType.Claim) {
            profileSetupRoute.set(ProfileSetupRoute.SetupClaimed)
        } else {
            profileSetupRoute.set(ProfileSetupRoute.SetupRecovered)
        }
        this.previous()
    }

    next(): void {
        let nextRoute: OnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.AppSetup: {
                const _onboardingProfile = get(onboardingProfile)
                if (_onboardingProfile?.isDeveloperProfile) {
                    nextRoute = OnboardingRoute.NetworkSetup
                } else {
                    nextRoute = OnboardingRoute.ProfileSetup
                }
                break
            }
            case OnboardingRoute.NetworkSetup:
                nextRoute = OnboardingRoute.ProfileSetup
                break
            case OnboardingRoute.ProfileSetup: {
                const _onboardingProfile = get(onboardingProfile)
                if (!_onboardingProfile?.mustVisitProfileName) {
                    const profileType = _onboardingProfile?.type
                    if (profileType === ProfileType.Software) {
                        const onboardingType = _onboardingProfile?.onboardingType
                        if (onboardingType === OnboardingType.Create) {
                            nextRoute = OnboardingRoute.StrongholdSetup
                        } else {
                            const restoreProfileType = _onboardingProfile?.restoreProfileType
                            if (restoreProfileType === RestoreProfileType.Stronghold) {
                                nextRoute = OnboardingRoute.StorageProtectionSetup
                            } else {
                                nextRoute = OnboardingRoute.StrongholdSetup
                            }
                        }
                    } else {
                        nextRoute = OnboardingRoute.StorageProtectionSetup
                    }
                } else {
                    nextRoute = OnboardingRoute.ProfileRecovery
                }
                break
            }
            case OnboardingRoute.StorageProtectionSetup: {
                const _onboardingProfile = get(onboardingProfile)
                const profileType = _onboardingProfile?.type
                if (profileType === ProfileType.Ledger) {
                    nextRoute = OnboardingRoute.LedgerSetup
                } else {
                    const onboardingType = _onboardingProfile?.onboardingType
                    if (onboardingType === OnboardingType.Claim) {
                        nextRoute = OnboardingRoute.ShimmerClaiming
                    } else if (onboardingType === OnboardingType.Create) {
                        nextRoute = OnboardingRoute.ProfileBackup
                    } else {
                        nextRoute = OnboardingRoute.Congratulations
                    }
                }
                break
            }
            case OnboardingRoute.ProfileRecovery: {
                const restoreProfileType = get(onboardingProfile)?.restoreProfileType
                if (
                    restoreProfileType === RestoreProfileType.Mnemonic ||
                    restoreProfileType === RestoreProfileType.Stronghold
                ) {
                    profileSetupRoute.set(ProfileSetupRoute.EnterName)
                    nextRoute = OnboardingRoute.ProfileSetup
                }
                break
            }

            case OnboardingRoute.StrongholdSetup: {
                nextRoute = OnboardingRoute.StorageProtectionSetup
                break
            }
            case OnboardingRoute.ProfileBackup: {
                nextRoute = OnboardingRoute.Congratulations
                break
            }
            case OnboardingRoute.LedgerSetup: {
                const onboardingType = get(onboardingProfile)?.onboardingType
                if (onboardingType === OnboardingType.Claim) {
                    nextRoute = OnboardingRoute.ShimmerClaiming
                } else {
                    nextRoute = OnboardingRoute.Congratulations
                }
                break
            }
            case OnboardingRoute.ShimmerClaiming: {
                nextRoute = OnboardingRoute.Congratulations
                break
            }
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

function getInitialRoute(): OnboardingRoute {
    if (get(hasCompletedAppSetup)) {
        if (get(onboardingProfile)?.id) {
            if (get(onboardingProfile)?.isDeveloperProfile) {
                return OnboardingRoute.NetworkSetup
            } else {
                return OnboardingRoute.ProfileSetup
            }
        } else {
            if (shouldBeDeveloperProfile()) {
                return OnboardingRoute.NetworkSetup
            } else {
                return OnboardingRoute.ProfileSetup
            }
        }
    } else {
        return OnboardingRoute.AppSetup
    }
}

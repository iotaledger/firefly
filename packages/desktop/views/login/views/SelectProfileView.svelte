<script lang="ts">
    import { PopupId, openOverlay } from '@auxiliary/popup'
    import { initialiseOnboardingFlow, shouldBeDeveloperProfile } from '@contexts/onboarding'
    import {
        AppContext,
        isStrongholdUpdated,
        mobile,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { ProfileType, loadPersistedProfileIntoActiveProfile, profiles } from '@core/profile'
    import { OnboardingRoute, loginRouter, onboardingRouter, routerManager } from '@core/router'
    import features from '@features/features'
    import { Icon, Logo, Profile } from '@ui'

    function onContinueClick(profileId: string): void {
        loadPersistedProfileIntoActiveProfile(profileId)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        const isDeveloperProfile = shouldBeDeveloperProfile()
        await initialiseOnboardingFlow({
            isDeveloperProfile,
            ...(!isDeveloperProfile && { networkId: NetworkId.Shimmer }),
        })
        $routerManager.goToAppContext(AppContext.Onboarding)
        $onboardingRouter.goTo(isDeveloperProfile ? OnboardingRoute.NetworkSetup : OnboardingRoute.ProfileSetup)
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openOverlay({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }
</script>

<section class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 px-40 pt-48 pb-20">
    <Logo width="64px" logo="logo-firefly" classes="absolute top-20" />
    <div
        class="profiles-wrapper h-auto items-start justify-center w-full {!$mobile &&
            'overlay-scrollbar'} flex flex-row flex-wrap"
    >
        {#each $profiles as profile}
            <div class="mx-7 mb-8">
                <Profile
                    {profile}
                    bgColor="blue"
                    onClick={onContinueClick}
                    updateRequired={profile?.type === ProfileType.Software &&
                        !isStrongholdUpdated(profile) &&
                        features.onboarding.strongholdVersionCheck.enabled}
                    classes="cursor-pointer"
                />
            </div>
        {/each}
        <div class="mx-7 mb-8">
            <Profile
                onClick={onAddProfileClick}
                name={localize('general.addProfile')}
                classes="border-solid border-2 border-gray-400 cursor-pointer"
            >
                <Icon height="15" width="15" icon="plus" classes="text-blue-500" />
            </Profile>
        </div>
    </div>
</section>

<script lang="ts">
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { initialiseOnboardingProfile, onboardingProfile, shouldBeDeveloperProfile } from '@contexts/onboarding'
    import {
        AppContext,
        isLatestStrongholdVersion,
        mobile,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType, loadPersistedProfileIntoActiveProfile, profiles, removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { loginRouter, routerManager } from '@core/router'
    import features from '@features/features'
    import { Icon, Logo, Profile } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
    import { onMount } from 'svelte'

    function onContinueClick(profileId: string): void {
        loadPersistedProfileIntoActiveProfile(profileId)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        onboardingRouter.set(new OnboardingRouter())
        await initialiseOnboardingProfile(shouldBeDeveloperProfile())
        $routerManager.goToAppContext(AppContext.Onboarding)
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view from onboarding
        if ($onboardingProfile) {
            if ($onboardingProfile.hasInitialisedProfileManager) {
                await destroyProfileManager()
                await removeProfileFolder($onboardingProfile.id)
            }
            $onboardingProfile = undefined
        }
    })
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
                    onClick={onContinueClick}
                    updateRequired={profile?.type === ProfileType.Software &&
                        !isLatestStrongholdVersion(profile?.strongholdVersion) &&
                        features.onboarding.strongholdVersionCheck.enabled}
                />
            </div>
        {/each}
        <div class="flex flex-col mx-7 mb-8 justify-between items-center space-y-3">
            <button
                on:click={onAddProfileClick}
                name={localize('general.addProfile')}
                class="w-18 h-18 border-solid border-2 border-gray-400 cursor-pointer rounded-full flex justify-center items-center"
            >
                <Icon height="15" width="15" icon={IconEnum.Plus} classes="text-blue-500" />
            </button>
        </div>
    </div>
</section>

<script lang="ts">
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { initialiseOnboardingProfile, onboardingProfile, shouldBeDeveloperProfile } from '@contexts/onboarding'
    import {
        AppContext,
        isLatestStrongholdVersion,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        ProfileType,
        clearProfileFromMemory,
        loadPersistedProfileIntoActiveProfile,
        profiles,
        removeProfileFolder,
    } from '@core/profile'
    import { loginRouter, routerManager, OnboardingRouter, onboardingRouter } from '@core/router'
    import features from '@features/features'
    import { Icon, Logo, Profile } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { onMount } from 'svelte'
    import { Logo as LogoEnum } from '@ui/enums'

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
            if ($onboardingProfile.secretManagerOptions) {
                await clearProfileFromMemory()
                await removeProfileFolder($onboardingProfile.id)
            }
            $onboardingProfile = undefined
        }
    })
</script>

<section class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 px-40 pt-48 pb-20">
    <logo-wrapper class="absolute top-20">
        <Logo width="64px" logo={LogoEnum.Firefly} />
    </logo-wrapper>
    <div class="profiles-wrapper h-auto items-start justify-center w-full overlay-scrollbar flex flex-row flex-wrap">
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

<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Icon, Logo, Profile } from 'shared/components'
    import {
        AppStage,
        appStage,
        isAwareOfCrashReporting,
        mobile,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { initialiseOnboardingProfile } from '@contexts/onboarding'
    import { ProfileType, profiles, loadPersistedProfileIntoActiveProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'

    const dispatch = createEventDispatcher()

    function handleContinueClick(id: string) {
        loadPersistedProfileIntoActiveProfile(id)
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
        initialiseOnboardingProfile({ isDeveloperProfile: $appStage !== AppStage.PROD })
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            type: 'legalUpdate',
            hideClose: true,
            preventClose: true,
        })
    }

    /**
     * NOTE: We check for mobile because it's only necessary
     * for existing desktop installation.
     */
    $: if ($popupState?.type === null && !$popupState?.active && !$mobile && !$isAwareOfCrashReporting) {
        openPopup({
            type: 'crashReporting',
            hideClose: true,
            preventClose: true,
        })
    }
</script>

<section class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 px-40 pt-48 pb-20">
    <Logo width="64px" logo="logo-firefly" classes="absolute top-20" />
    <div
        class="profiles-wrapper h-auto items-start justify-center w-full {!$mobile &&
            'overflow-y-auto'} flex flex-row flex-wrap"
    >
        {#each $profiles as profile}
            <div class="mx-7 mb-8">
                <Profile
                    bgColor="blue"
                    onClick={handleContinueClick}
                    name={profile.name}
                    id={profile.id}
                    isDeveloper={profile.isDeveloperProfile}
                    networkType={profile?.networkType ?? NetworkType.Devnet}
                    networkProtocol={profile?.networkProtocol ?? NetworkProtocol.IOTA}
                    isLedgerProfile={profile?.type === ProfileType.Ledger ||
                        profile?.type === ProfileType.LedgerSimulator}
                    classes="cursor-pointer"
                />
            </div>
        {/each}
        <div class="mx-7 mb-8">
            <Profile
                onClick={addProfile}
                name={localize('general.addProfile')}
                classes="border-solid border-2 border-gray-400 cursor-pointer"
            >
                <Icon height="15" width="15" icon="plus" classes="text-blue-500" />
            </Profile>
        </div>
    </div>
</section>

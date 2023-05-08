<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Icon, Logo, Profile } from 'shared/components'
    import { mobile, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTos } from 'shared/lib/app'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { ProfileType } from 'shared/lib/typings/profile'
    import { isStrongholdOutdated } from '@lib/stronghold'
    import { localize } from '@core/i18n'
    import { isAwareOfCrashReporting } from '@lib/appSettings'

    const dispatch = createEventDispatcher()

    function handleContinueClick(id: string) {
        setActiveProfile(id)
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTos()) {
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
            <div class="mx-4 mb-8">
                <Profile
                    bgColor="blue"
                    onClick={handleContinueClick}
                    name={profile.name}
                    id={profile.id}
                    isDeveloper={profile.isDeveloperProfile}
                    isLedgerProfile={profile?.type === ProfileType.Ledger ||
                        profile?.type === ProfileType.LedgerSimulator}
                    isStrongholdOutdated={isStrongholdOutdated(profile)}
                    classes="cursor-pointer"
                />
            </div>
        {/each}
        <div class="mx-4 mb-8">
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

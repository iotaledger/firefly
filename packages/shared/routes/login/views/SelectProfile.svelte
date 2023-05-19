<script lang="typescript">
    import { localize } from '@core/i18n'
    import { backButtonStore } from '@core/router'
    import { isAwareOfCrashReporting } from '@lib/appSettings'
    import { isStrongholdOutdated } from '@lib/stronghold'
    import { Icon, Logo, Profile } from 'shared/components'
    import { mobile, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTos } from 'shared/lib/app'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { ProfileType } from 'shared/lib/typings/profile'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    $backButtonStore?.reset()

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

<section
    class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 {$mobile
        ? 'p-4 pt-48'
        : 'px-40 pt-48 pb-20'}"
>
    <Logo width="64px" logo="logo-firefly" classes="absolute top-20" />
    <div
        class="profiles-wrapper h-auto justify-center w-full overflow-y-auto flex {$mobile && $profiles?.length === 1
            ? 'flex-col items-center'
            : 'flex-row items-start'} flex-wrap"
    >
        {#each $profiles as profile}
            <div class="mx-7 mb-8">
                <Profile
                    bgColor="blue"
                    onClick={handleContinueClick}
                    name={profile.name}
                    id={profile.id}
                    isDeveloper={profile.isDeveloperProfile}
                    isLedgerProfile={profile?.type === ProfileType.Ledger ||
                        profile?.type === ProfileType.LedgerSimulator}
                    classes="cursor-pointer"
                    strongholdUpdateRequired={profile?.type === ProfileType.Software && isStrongholdOutdated(profile)}
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

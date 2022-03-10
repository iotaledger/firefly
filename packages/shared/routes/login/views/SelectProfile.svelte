<script lang="typescript">
    import { createEventDispatcher, onMount } from 'svelte'
    import { Icon, Logo, Profile } from 'shared/components'
    import { mobile, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTos } from 'shared/lib/app'
    import { openPopup } from 'shared/lib/popup'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { ProfileType } from 'shared/lib/typings/profile'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(id: string) {
        setActiveProfile(id)
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
    }

    onMount(() => {
        if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTos()) {
            openPopup({
                type: 'legalUpdate',
                hideClose: true,
                preventClose: true,
            })
        }
    })
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
                    {locale}
                    onClick={handleContinueClick}
                    name={profile.name}
                    id={profile.id}
                    isDeveloper={profile.isDeveloperProfile}
                    isLedgerProfile={profile?.type === ProfileType.Ledger ||
                        profile?.type === ProfileType.LedgerSimulator}
                    classes="cursor-pointer"
                />
            </div>
        {/each}
        <div class="mx-4 mb-8">
            <Profile
                onClick={addProfile}
                name={locale('general.addProfile')}
                classes="border-solid border-2 border-gray-400 cursor-pointer"
            >
                <Icon icon="plus" classes="text-blue-500" />
            </Profile>
        </div>
    </div>
</section>

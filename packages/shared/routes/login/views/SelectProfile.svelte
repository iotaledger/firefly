<script lang="typescript">
    import { createEventDispatcher, onMount } from 'svelte'
    import { Icon, Logo, Profile } from 'shared/components'
    import { mobile, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTos } from 'shared/lib/app'
    import { openPopup } from 'shared/lib/popup'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { ProfileType } from 'shared/lib/typings/profile'
    import type { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(profile: Profile): void {
        setActiveProfile(profile)
        dispatch('next')
    }

    function addProfile(): void {
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
    <div class="profiles-wrapper h-auto items-start justify-center w-full overflow-y-auto flex flex-row flex-wrap">
        {#each $profiles as profile}
            <div class="mx-4 mb-8">
                <Profile
                    bgColor="blue"
                    {locale}
                    onClick={handleContinueClick}
                    profile={profile}
                    classes="cursor-pointer" />
            </div>
        {/each}
        <div class="mx-4 mb-8">
            <Profile
                onClick={addProfile}
                {locale}
                classes="border-solid border-2 border-gray-400 cursor-pointer">
                <Icon icon="plus" classes="text-blue-500" />
            </Profile>
        </div>
    </div>
</section>

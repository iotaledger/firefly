<script lang="typescript">
    import { Icon, Logo, Profile, SafeArea } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { ProfileType } from 'shared/lib/typings/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(id) {
        setActiveProfile(id)
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
    }
</script>

{#if $mobile}
    <SafeArea top bottom>
        <section class="flex flex-col h-full bg-gray-900">
            <div
                class="profiles-wrapper flex flex-row flex-wrap flex-grow h-auto items-center justify-center content-center">
                {#each $profiles as profile}
                    <div class="mx-4 mb-8">
                        <Profile
                            bgColor="blue"
                            {locale}
                            onClick={handleContinueClick}
                            name={profile.name}
                            id={profile.id}
                            isDeveloper={profile.isDeveloperProfile}
                            isLedgerProfile={profile?.type === ProfileType.Ledger || profile?.type === ProfileType.LedgerSimulator}
                            classes="cursor-pointer" />
                    </div>
                {/each}
            </div>
            <div class="profiles-wrapper h-auto items-start justify-center flex flex-row flex-wrap">
                <div class="mx-4 mb-8 self-end">
                    <Profile
                        onClick={addProfile}
                        name={locale('general.addProfile')}
                        classes="border-solid border-2 border-gray-400 cursor-pointer">
                        <Icon icon="plus" classes="text-blue-500" />
                    </Profile>
                </div>
            </div>
        </section>
    </SafeArea>
{:else}
    <section class="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-900 px-40 pt-48 pb-20">
        <Logo width="64px" logo="logo-firefly" classes="absolute top-20" />
        <div class="profiles-wrapper h-auto items-start justify-center w-full overflow-y-auto flex flex-row flex-wrap">
            {#each $profiles as profile}
                <div class="mx-4 mb-8">
                    <Profile
                        bgColor="blue"
                        {locale}
                        onClick={handleContinueClick}
                        name={profile.name}
                        id={profile.id}
                        isDeveloper={profile.isDeveloperProfile}
                        isLedgerProfile={profile?.type === ProfileType.Ledger || profile?.type === ProfileType.LedgerSimulator}
                        classes="cursor-pointer" />
                </div>
            {/each}
            <div class="mx-4 mb-8">
                <Profile
                    onClick={addProfile}
                    name={locale('general.addProfile')}
                    classes="border-solid border-2 border-gray-400 cursor-pointer">
                    <Icon icon="plus" classes="text-blue-500" />
                </Profile>
            </div>
        </div>
    </section>
{/if}

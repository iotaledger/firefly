<script lang="typescript">
    import { Icon, Logo, Profile } from 'shared/components'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { createEventDispatcher } from 'svelte'
    import { ProfileType } from 'shared/lib/profile'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(id) {
        setActiveProfile(id)
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
    }
</script>

{#if mobile}
    <div>Not yet implemented</div>
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
                        isLedgerProfile={profile?.profileType === ProfileType.Ledger || profile?.profileType === ProfileType.LedgerSimulator}
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

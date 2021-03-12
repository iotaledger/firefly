<script lang="typescript">
    import { Icon, Logo, Profile } from 'shared/components'
    import { profiles, setActiveProfile } from 'shared/lib/profile'
    import { createEventDispatcher } from 'svelte'

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
    <section class="flex flex-col h-screen bg-white dark:bg-blue-900 items-center">
        <Logo width="64px" logo="logo-firefly" classes="absolute top-20 transform left-1/2 -translate-x-1/2" />
        <div class="h-full space-x-20 flex flex-wrap justify-center items-start content-center mt-10 mx-20">
            {#each $profiles as profile}
                <div class="mb-6">
                    <Profile
                        bgColor="blue"
                        {locale}
                        onClick={handleContinueClick}
                        name={profile.name}
                        id={profile.id}
                        isDeveloper={profile.isDeveloperProfile}
                        classes="cursor-pointer" />
                </div>
            {/each}
            <div class="mb-6">
                <Profile
                    onClick={addProfile}
                    name={locale('general.add_profile')}
                    classes="border-solid border-2 border-gray-400 cursor-pointer">
                    <Icon icon="plus" classes="text-blue-500" />
                </Profile>
            </div>
        </div>
    </section>
{/if}

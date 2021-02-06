<script>
    import { createEventDispatcher } from 'svelte'
    import { Logo, Profile, Icon } from 'shared/components'
    import { profiles, setActiveProfile } from 'shared/lib/profile'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(id) {
        setActiveProfile(id);
        dispatch('next')
    }

    function addProfile() {
        dispatch('next', { shouldAddProfile: true })
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <section class="flex flex-col h-full bg-white items-center justify-center">
        <Logo width="64px" logo="logo-firefly" classes="absolute top-24" />
            <div class="space-x-20 flex justify-center items-center">
                {#each $profiles as profile}
                    <Profile locale={locale} onClick={handleContinueClick} name={profile.name} id={profile.id} isDeveloper={profile.isDeveloperProfile} />
                {/each}
                <Profile onClick={addProfile}  name="Add Profile" bgColor="#fff" classes="border-solid border-2 border-gray-400">
                    <Icon icon="plus" classes="text-blue-500"/>
                </Profile>
            </div>
    </section>
{/if}

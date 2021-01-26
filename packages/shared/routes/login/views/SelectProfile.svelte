<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button, Logo, Profile, Icon } from 'shared/components'
    import { profiles, setActiveProfile } from 'shared/lib/app'

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
    <section class="flex flex-col h-screen bg-white">
        <Logo width="64px" logo="logo-firefly" classes="mt-24 mx-auto" />
        <div class="px-48 mt-32	flex justify-evenly items-center">
            {#each $profiles as profile}
                <Profile onClick={handleContinueClick} name={profile.name} id={profile.id} />
            {/each}
            <Profile onClick={addProfile}  name="Add Profile" bgColor="#fff" classes="border-solid border-2 border-gray-400">
                <Icon icon="plus" classes="text-blue-500" width={16} height={19} />
            </Profile>
        </div>
    </section>
{/if}

<script lang="typescript">
    import { onMount, createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'
    import { newProfile, saveProfile, setActiveProfile } from 'shared/lib/profile'

    export let locale
    export let mobile

    onMount(() => {
        // This is the last screen in onboarding for all flows i.e., if you create a new wallet or import stronghold
        // When this component mounts, ensure that the profile is persisted in the local storage.
        saveProfile($newProfile)
        setActiveProfile($newProfile.id)

        newProfile.set(null)
    })

    const dispatch = createEventDispatcher()

    const handleContinueClick = () => {
        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.congratulations.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.congratulations.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration width="100%" illustration="congratulations-desktop" />
        </div>
    </OnboardingLayout>
{/if}

<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Icon, Text } from 'shared/components'
    import { newProfile, saveProfile, setActiveProfile } from 'shared/lib/profile'
    import { createEventDispatcher, onMount } from 'svelte'

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
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <div class="bg-green-100 rounded-2xl relative -top-10">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{locale('views.congratulations.title')}</Text>
                <Text type="p" secondary classes="mb-2">{locale('views.congratulations.body')}</Text>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.finishSetup')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="congratulations-desktop" width="100%" height="auto" />
        </div>
    </OnboardingLayout>
{/if}

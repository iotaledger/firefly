<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.onboarding_1.title')}</Text>
            <Text type="p" secondary>{locale('views.onboarding_1.body')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="onboarding-1-desktop" />
        </div>
    </OnboardingLayout>
{/if}

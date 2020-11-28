<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button, Logo } from 'shared/components'

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
            <Logo width="64px" logo="logo-firefly" classes="mb-10" />
            <Text type="h1" classes="mb-4">{locale('views.onboarding_1.title')}</Text>
            <Text type="p" secondary>{locale('views.onboarding_1.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="welcome-1-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}

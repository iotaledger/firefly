<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile

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

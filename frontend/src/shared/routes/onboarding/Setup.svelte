<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(setupType) {
        dispatch('next', { setupType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h1">{locale('views.setup.title')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button ghost onClick={() => handleContinueClick('import')}>{locale('actions.import_wallet')}</Button>
            <Button onClick={() => handleContinueClick('new')}>{locale('actions.create_wallet')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="setup-desktop" />
        </div>
    </OnboardingLayout>
{/if}

<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'
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
            <Text type="h2">{locale('views.setup.title')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center gap-4">
            <Button secondary classes="flex-auto" onClick={() => handleContinueClick('import')}>
                {locale('actions.import_wallet')}
            </Button>
            <Button classes="flex-auto" onClick={() => handleContinueClick('new')}>{locale('actions.create_wallet')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="setup-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}

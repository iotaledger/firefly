<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, ImportTextfield, Button } from 'shared/components'
    export let locale
    export let mobile

    let input = ''
    let isSeed = false

    // TODO: remove this to enable seed support
    $: isSeed = input.length === 81

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next', { input })
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
            <Text type="h2" classes="mb-5">{locale('views.importFromText.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.importFromText.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromText.body2')}</Text>
            <Text type="h5" classes="mb-4">{locale('views.importFromText.body3')}</Text>
            <ImportTextfield bind:value={input} {locale} />
            {#if isSeed}
                <!-- TODO: remove this when enabling seed support -->
                <Text type="p" error secondary classes="mt-4">Seeds are not currently supported.</Text>
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={input.length === 0 || isSeed} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16 bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="import-from-text-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}

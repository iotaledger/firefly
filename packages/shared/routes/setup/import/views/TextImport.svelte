<script lang="typescript">
    import { Button, Illustration, ImportTextfield, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher, getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { ImportType } from '../Import.svelte'

    export let locale
    export let mobile

    const importType = getContext<Writable<ImportType>>('importType')

    let input = ''

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
            {#if $importType === ImportType.Seed}
                <Text type="h2" classes="mb-5">{locale('views.importFromText.seed.title')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.importFromText.seed.body')}</Text>
                <Text type="h5" classes="mb-3">{locale('views.importFromText.seed.enterSeed')}</Text>
            {:else if $importType === ImportType.Mnemonic}
                <Text type="h2" classes="mb-5">{locale('views.importFromText.mnemonic.title')}</Text>
                <Text type="p" secondary classes="mb-4">{locale('views.importFromText.mnemonic.body1')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.importFromText.mnemonic.body2')}</Text>
                <Text type="h5" classes="mb-3">{locale('views.importFromText.mnemonic.enterMnemonic')}</Text>
            {/if}
            {#if $importType === ImportType.Seed}
                <!-- TODO: remove this when enabling seed support -->
                <Text type="p" error secondary classes="mb-3">Seeds are not currently supported.</Text>
            {/if}
            <ImportTextfield type={$importType} bind:value={input} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button
                classes="flex-1"
                disabled={input.length === 0 || $importType === ImportType.Seed}
                onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="import-from-text-desktop" width="auto" height="100%" />
        </div>
    </OnboardingLayout>
{/if}

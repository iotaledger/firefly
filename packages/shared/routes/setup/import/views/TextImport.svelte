<script lang="typescript">
    import { Button, Illustration, ImportTextfield, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { checkChrysalisSnapshot, ongoingSnapshot } from 'shared/lib/migration'
    import { createEventDispatcher, getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { get } from 'svelte/store'
    import { ImportType } from '../Import.svelte'

    export let locale
    export let mobile

    const importType = getContext<Writable<ImportType>>('importType')

    export let isGettingMigrationData
    let input = ''

    let snapshotBusy = false

    const dispatch = createEventDispatcher()

    async function handleContinueClick() {
        if ($importType === ImportType.Seed) {
            // Migration: snapshot check
            snapshotBusy = true
            await checkChrysalisSnapshot()
            if (get(ongoingSnapshot) === false) {
                dispatch('next', { input })
            }
            snapshotBusy = false
        } else {
            dispatch('next', { input })
        }
    }
    function handleBackClick() {
        if (!isGettingMigrationData) {
            dispatch('previous')
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale(`views.importFromText.${$importType}.title`)}</Text>
            <Text type="p" secondary classes="mb-8">{locale(`views.importFromText.${$importType}.body`)}</Text>
            <Text type="h5" classes="mb-3">{locale(`views.importFromText.${$importType}.enter`)}</Text>
            <ImportTextfield disabled={isGettingMigrationData} type={$importType} bind:value={input} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button
                classes="flex-1"
                disabled={input.length === 0 || isGettingMigrationData || snapshotBusy}
                onClick={() => handleContinueClick()}>
                {#if isGettingMigrationData}
                    <Spinner
                        busy={isGettingMigrationData}
                        message={locale('views.migrate.restoringWallet')}
                        classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="import-from-text-desktop" width="auto" height="100%" />
        </div>
    </OnboardingLayout>
{/if}

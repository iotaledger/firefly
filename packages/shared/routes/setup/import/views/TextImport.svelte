<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, ImportTextfield, Button, Spinner } from 'shared/components'
    export let locale
    export let mobile

    let input = ''
    let isSeed = false

    export let isGettingMigrationData

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next', { input })
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
            <Text type="h2" classes="mb-5">{locale('views.importFromText.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.importFromText.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromText.body2')}</Text>
            <Text type="h5" classes="mb-4">{locale('views.importFromText.body3')}</Text>
            <ImportTextfield disabled={isGettingMigrationData} bind:value={input} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={input.length === 0 || isGettingMigrationData} onClick={() => handleContinueClick()}>
                {#if isGettingMigrationData}
                    <Spinner busy={isGettingMigrationData} message={locale('views.migrate.restoringWallet')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="import-from-text-desktop" width="auto" height="100%" />
        </div>
    </OnboardingLayout>
{/if}

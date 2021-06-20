<script>
    import { Button, OnboardingLayout, Text, Video } from 'shared/components'
    import { LEDGER_MIGRATION_VIDEO } from 'shared/lib/migration'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleNextClick() {
        dispatch('next')
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
            <Text type="h2" classes="mb-5">{locale('views.importFromTrinityLedger.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromTrinityLedger.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={handleNextClick}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full px-32 flex justify-end items-center bg-gray-50 dark:bg-gray-900">
            <Video video={LEDGER_MIGRATION_VIDEO} />
        </div>
    </OnboardingLayout>
{/if}

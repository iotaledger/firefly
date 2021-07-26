<script>
    import { Button, Link, OnboardingLayout, Text, Video } from 'shared/components'
    import { LEDGER_MIGRATION_VIDEO } from 'shared/lib/migration'
    import { createEventDispatcher } from 'svelte'
    import { Electron } from 'shared/lib/electron'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleReadMoreClick() {
        Electron.openUrl('https://firefly.iota.org/faq#migration')
    }

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
            <Text type="h2" classes="mb-5">{locale('views.legacyLedgerIntro.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.legacyLedgerIntro.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.legacyLedgerIntro.body2')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={handleNextClick}>{locale('actions.continue')}</Button>
        </div>
        <div
            slot="rightpane"
            class="w-full h-full px-32 flex flex-col flex-wrap justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Video video={LEDGER_MIGRATION_VIDEO} />
            <Link onClick={handleReadMoreClick} classes="mt-7" icon="info">{locale('views.legacyLedgerIntro.readMore')}</Link>
        </div>
    </OnboardingLayout>
{/if}

<script lang="typescript">
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, Link, OnboardingLayout, Text, Video } from 'shared/components'
    import { localize } from '@core/i18n'
    import { initialiseMigrationListeners, LEDGER_MIGRATION_VIDEO } from '@lib/migration'
    import { showAppNotification } from '@lib/notifications'
    import { Platform } from '@lib/platform'
    import { api, isBackgroundSyncing } from '@lib/wallet'

    const dispatch = createEventDispatcher()

    function handleReadMoreClick() {
        Platform.openUrl('https://firefly.iota.org/faq#migration')
    }

    function handleNextClick() {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }

    onMount(() => {
        // This is the first screen that mounts when a user wants to migrate additional account index
        initialiseMigrationListeners()
        if (get(isBackgroundSyncing)) {
            api.stopBackgroundSync({
                onSuccess() {
                    isBackgroundSyncing.set(false)
                },
                onError() {
                    showAppNotification({
                        type: 'error',
                        message: localize('error.account.syncing'),
                    })
                },
            })
        }
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.legacyLedgerIntro.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.legacyLedgerIntro.body1')}</Text>
        <Text type="p" secondary classes="mb-8">{localize('views.legacyLedgerIntro.body2')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={handleNextClick}>{localize('actions.continue')}</Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full px-32 flex flex-col flex-wrap justify-center items-center bg-gray-50 dark:bg-gray-900"
    >
        <Video video={LEDGER_MIGRATION_VIDEO} />
        <Link onClick={handleReadMoreClick} classes="mt-7" icon="info"
            >{localize('views.legacyLedgerIntro.readMore')}</Link
        >
    </div>
</OnboardingLayout>

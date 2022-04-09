<script lang="typescript">
    import { Button, Link, OnboardingLayout, Text, Video } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { initialiseMigrationListeners, LEDGER_MIGRATION_VIDEO } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { api, isBackgroundSyncing } from 'shared/lib/wallet'
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from '@core/i18n'

    export let locale: Locale

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
                onError(err) {
                    showAppNotification({
                        type: 'error',
                        message: locale('error.account.syncing'),
                    })
                },
            })
        }
    })
</script>

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
        class="w-full h-full px-32 flex flex-col flex-wrap justify-center items-center bg-gray-50 dark:bg-gray-900"
    >
        <Video video={LEDGER_MIGRATION_VIDEO} />
        <Link onClick={handleReadMoreClick} classes="mt-7" icon="info"
            >{locale('views.legacyLedgerIntro.readMore')}</Link
        >
    </div>
</OnboardingLayout>

<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { isLedgerConnected, pollLedgerStatus, stopPollLedgerStatus } from 'shared/lib/ledger'
    import { currentLedgerMigrationProgress, LedgerMigrationProgress } from 'shared/lib/migration'
    import { popupState } from 'shared/lib/popup'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    $: if (!$isLedgerConnected && !$popupState?.active) {
        handleBackClick()
    }

    onMount(() => {
        currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
        pollLedgerStatus()
    })

    // TODO: missing functionality
    function handleContinueClick() {
        dispatch('next')
    }

    function handleBackClick() {
        stopPollLedgerStatus()
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {locale} showLedgerProgress showLedgerVideoButton>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.setupLedger.title')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body1')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body2')}</Text>
            <Text type="p" secondary>{locale('views.setupLedger.body3')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}

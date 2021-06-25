<script lang="typescript">
    import { Button, OnboardingLayout, Text, Spinner } from 'shared/components'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { currentLedgerMigrationProgress, LedgerMigrationProgress } from 'shared/lib/migration'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile
    let checkingConnectionStatus = false

    const dispatch = createEventDispatcher()

    onMount(() => {
        currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
    })

    function handleContinueClick() {
        checkingConnectionStatus = true
        promptUserToConnectLedger(
            () => dispatch('next'),
            () => (checkingConnectionStatus = false)
        )
    }

    function handleBackClick() {
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
            <Button classes="w-full" onClick={handleContinueClick}>
                {#if checkingConnectionStatus}
                    <Spinner busy message={locale('views.setupLedger.checkingConnection')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}

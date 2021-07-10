<script>
    import { Button, Icon, Illustration, OnboardingLayout, Text } from 'shared/components'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    export let busy = false

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        busy = true
        const _onConnected = () => dispatch('next')
        const _onCancel = () => (busy = false)
        promptUserToConnectLedger(true, _onConnected, _onCancel)
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
            <Text type="h2" classes="mb-5">{locale('views.switchLedgerApps.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.switchLedgerApps.body')}</Text>
            <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-40">
                <div class="flex flex-col flex-wrap space-y-2">
                    <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                        <Icon icon="ledger-app" width="32" height="32" classes="text-white" />
                    </div>
                    <Text type="p" secondary>{locale('views.switchLedgerApps.ledgerApp')}</Text>
                </div>
                <Icon icon="chevron-right" classes="-mt-6 text-blue-400" />
                <div class="flex flex-col flex-wrap space-y-2">
                    <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                        <Icon icon="ledger-app-legacy" width="32" height="32" classes="text-white" />
                    </div>
                    <Text type="p" secondary>{locale('views.switchLedgerApps.ledgerLegacyApp')}</Text>
                </div>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={busy} onClick={handleContinueClick}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Illustration width="100%" illustration="ledger-switch-app-desktop" />
        </div>
    </OnboardingLayout>
{/if}

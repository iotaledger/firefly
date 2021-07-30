<script>
    import { Button, Icon, Text } from 'shared/components'
    import { stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { closePopup } from 'shared/lib/popup'
    import { LedgerAppName } from 'shared/lib/typings/ledger'
    import { onDestroy } from 'svelte'

    export let legacy
    export let handleClose
    export let locale

    /**
     * Used to avoid race condition with the reactive poll on dashboard
     * as stopPollingLedgerStatus was running twice,
     * stopping a newly created poll
     */
    let pollStopped = false

    function handleCancelClick() {
        stopPollingLedgerStatus()
        pollStopped = true
        if ('function' === typeof handleClose) {
            handleClose()
        }
        closePopup()
    }

    onDestroy(() => {
        if (!pollStopped) {
            stopPollingLedgerStatus()
        }
    })
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center mb-7">
        <Icon icon={legacy ? 'ledger-app-legacy' : 'ledger-app'} width="32" height="32" classes="text-white" />
    </div>
    <Text type="p" classes="mb-6">
        {locale(`popups.ledgerNotConnected.${legacy ? 'connectLegacy' : 'connect'}`, {
            values: legacy ? { legacy: LedgerAppName.IOTALegacy } : {},
        })}
    </Text>
    <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
</div>

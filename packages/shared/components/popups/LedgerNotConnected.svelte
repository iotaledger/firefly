<script>
    import { Button, Icon, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { stopPollingLedgerStatus } from 'shared/lib/ledger'
    import { onDestroy } from 'svelte'

    export let legacy
    export let handleClose
    export let locale

    function handleCancelClick() {
        stopPollingLedgerStatus()
        if ('function' === typeof handleClose) {
            handleClose()
        }
        closePopup()
    }

    onDestroy(() => {
        stopPollingLedgerStatus()
    })
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center mb-7">
        <Icon icon={legacy ? 'ledger-app-legacy' : 'ledger-app'} width="32" height="32" classes="text-white" />
    </div>
    <Text type="p" classes="mb-6 px-16">{locale(`popups.ledgerNotConnected.${legacy ? 'connectLegacy' : 'connect'}`)}</Text>
    <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
</div>

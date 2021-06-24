<script>
    import { Button, Icon, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { stopPollingLedgerStatus } from 'shared/lib/ledger'

    export let message
    export let handleClose
    export let locale

    function handleCancelClick() {
        stopPollingLedgerStatus()
        if ('function' === typeof handleClose) {
            handleClose()
        }
        closePopup()
    }
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Icon icon="ledger" width="48" height="48" classes="mb-6 text-gray-800 dark:text-white" />
    <Text type="p" classes="mb-6 px-16">{message}</Text>
    <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
</div>

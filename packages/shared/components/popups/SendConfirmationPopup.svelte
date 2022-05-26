<script lang="typescript">
    import { Button, Text, KeyValueBox, ExpirationTimePicker } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { Recipient, trySend, ActivityStatus, ActivityType } from '@core/wallet'

    export let internal = false
    export let recipient: Recipient
    export let rawAmount: number
    export let amount: '0'
    export let unit: string

    $: internal = recipient.type === 'account'

    function onConfirm(): void {
        closePopup()

        function _send(): Promise<void> {
            const recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
            return trySend(recipientAddress, rawAmount)
        }

        if ($isSoftwareProfile) {
            _send()
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => _send(), undefined)
        }
    }

    function onCancel() {
        closePopup()
    }

    $: transactionDetails = {
        type: internal ? ActivityType.Transfer : ActivityType.Send,
        status: ActivityStatus.InProgress,
        amount: `${amount} ${unit}`,
        rawAmount,
        recipient,
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} />
        <KeyValueBox keyText={localize('general.expirationTime')}>
            <ExpirationTimePicker slot="value" />
        </KeyValueBox>
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>

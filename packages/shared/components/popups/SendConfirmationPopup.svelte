<script lang="typescript">
    import { Button, Text, KeyValueBox, ExpirationTimePicker } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { Recipient, trySend, ActivityType, InclusionState } from '@core/wallet'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { CurrencyTypes } from '@lib/typings/currency'

    export let internal = false
    export let recipient: Recipient
    export let rawAmount: number
    export let amount: '0'
    export let unit: string
    export let expireDate: Date

    $: internal = recipient.type === 'account'

    function onConfirm(): void {
        closePopup()

        if ($isSoftwareProfile) {
            void send()
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => send(), undefined)
        }
    }

    function send(): Promise<void> {
        const recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
        return trySend(recipientAddress, rawAmount)
    }

    function onCancel(): void {
        closePopup()
    }

    $: formattedFiatValue =
        formatCurrency(
            convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings?.currency])
        ) || '-'

    $: transactionDetails = {
        type: internal ? ActivityType.Transfer : ActivityType.Send,
        inclusionState: InclusionState.Pending,
        amount,
        unit,
        recipient,
        expireDate,
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} {formattedFiatValue} />
        <KeyValueBox keyText={localize('general.expirationTime')}>
            <ExpirationTimePicker bind:expireDate slot="value" />
        </KeyValueBox>
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>

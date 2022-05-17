<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Button, Text, KeyValueBox, ExpirationTimePicker } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { sendExternalTransaction, sendInternalTransaction } from '@lib/send'
    import { isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { IAccountState, selectedAccount } from '@core/account'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { ActivityStatus, ActivityType } from '@lib/typings/activity'

    export let internal = false
    export let to = ''
    export let toAccount: IAccountState
    export let amount = 0
    export let unit = Unit.i

    $: internal = toAccount?.depositAddress ? true : false
    $: to = toAccount?.depositAddress ?? to

    function onConfirm(): void {
        closePopup()

        function _send(): void {
            return internal
                ? sendInternalTransaction($selectedAccount.id, to, amount, internal)
                : sendExternalTransaction($selectedAccount.id, to, amount)
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
        value: amount,
        unit,
        ...(internal && { account: toAccount }),
        ...(!internal && { address: to }),
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} />
        <KeyValueBox keyText={localize('general.expirationTime')}>
            <ExpirationTimePicker value="value" />
        </KeyValueBox>
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>

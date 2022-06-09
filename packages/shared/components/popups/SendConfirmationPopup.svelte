<script lang="typescript">
    import { Button, Text, KeyValueBox, ExpirationTimePicker } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { Recipient, trySend, ActivityType, InclusionState } from '@core/wallet'
    import { buildBasicOutput, prepareTransaction, selectedAccount } from '@core/account'
    import { convertBech32AddressToEd25519Address } from '@lib/ed25519'

    export let internal = false
    export let recipient: Recipient
    export let rawAmount: number
    export let amount: '0'
    export let unit: string

    let output
    let preparedTransaction

    $: internal = recipient.type === 'account'
    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address

    async function buildOutput() {
        output = await buildBasicOutput($selectedAccount.id, {
            unlockConditions: [
                {
                    type: 0,
                    address: {
                        type: 0,
                        pubKeyHash: '0x' + convertBech32AddressToEd25519Address(recipientAddress),
                    },
                },
            ],
        })
    }

    async function prepare() {
        preparedTransaction = await prepareTransaction($selectedAccount.id, [output])
    }

    $: rawAmount, recipientAddress, buildOutput()
    $: output && prepare()

    function onConfirm(): void {
        closePopup()

        if ($isSoftwareProfile) {
            void send()
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => send(), undefined)
        }
    }

    function send(): Promise<void> {
        return trySend(recipientAddress, rawAmount)
    }

    function onCancel(): void {
        closePopup()
    }

    $: transactionDetails = {
        type: internal ? ActivityType.Transfer : ActivityType.Send,
        inclusiontState: InclusionState.Pending,
        amount,
        unit,
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

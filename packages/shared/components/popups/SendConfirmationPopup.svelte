<script lang="typescript">
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { ActivityType, InclusionState, Recipient, trySendOutput } from '@core/wallet'
    import type { OutputTypes } from '@iota/types'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { MILLISECONDS_PER_SECOND } from '@lib/time'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { Button, ExpirationTimePicker, KeyValueBox, Text } from 'shared/components'
    import { TransactionDetails } from 'shared/components/molecules'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { closePopup } from 'shared/lib/popup'

    export let internal = false
    export let recipient: Recipient
    export let rawAmount: number
    export let amount: '0'
    export let unit: string
    export let metadata: string
    export let tag: string

    let expirationDate: Date
    let storageDeposit = 0

    let preparedOutput: OutputTypes

    $: internal = recipient.type === 'account'
    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address

    let outputOptions

    async function _prepareOutput() {
        const unixTime = expirationDate ? Math.round(expirationDate.getTime() / MILLISECONDS_PER_SECOND) : undefined
        outputOptions = {
            recipientAddress,
            amount: String(rawAmount),
            features: {
                ...(metadata && { metadata }),
                ...(tag && { tag }),
            },
            unlocks: {
                ...(unixTime && { expiration: { unixTime } }),
            },
        }
        preparedOutput = await prepareOutput($selectedAccount.id, outputOptions, {
            remainderValueStrategy: {
                strategy: 'ReuseAddress',
                value: null,
            },
        })
        calculateStorageDepositFromOutput(preparedOutput)
    }

    function calculateStorageDepositFromOutput(output: OutputTypes) {
        if (output.type !== 2) {
            const storageDepositUnlockCondition = output?.unlockConditions?.find(
                (unlockCondition) => unlockCondition?.type === 1
            )
            if (storageDepositUnlockCondition?.type === 1) {
                storageDeposit = Number(storageDepositUnlockCondition.amount)
            } else {
                storageDeposit = Number(output.amount) - rawAmount
            }
        }
    }

    $: $$props, expirationDate, _prepareOutput()

    function onConfirm(): void {
        closePopup()

        if ($isSoftwareProfile) {
            void send()
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => send(), undefined)
        }
    }

    function send(): Promise<void> {
        return trySendOutput(outputOptions, preparedOutput)
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
        metadata,
        tag,
        storageDeposit: storageDeposit,
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} {formattedFiatValue} />
        <KeyValueBox keyText={localize('general.expirationTime')}>
            <ExpirationTimePicker slot="value" bind:value={expirationDate} />
        </KeyValueBox>
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>

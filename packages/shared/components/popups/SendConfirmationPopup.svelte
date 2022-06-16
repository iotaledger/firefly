<script lang="typescript">
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import {
        ActivityDirection,
        ActivityType,
        calculateStorageDepositFromOutput,
        getOutputOptions,
        IAsset,
        InclusionState,
        Recipient,
        trySendOutput,
    } from '@core/wallet'
    import type { OutputTypes } from '@iota/types'
    import type { OutputOptions } from '@iota/wallet'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { Button, ExpirationTimePicker, KeyValueBox, Text } from 'shared/components'
    import { TransactionDetails } from 'shared/components/molecules'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { closePopup, openPopup } from 'shared/lib/popup'

    export let asset: IAsset
    export let amount = '0'
    export let unit: string
    export let rawAmount: number
    export let recipient: Recipient
    export let internal = false
    export let metadata: string
    export let tag: string

    let expirationDate: Date
    let storageDeposit = 0

    let preparedOutput: OutputTypes
    let outputOptions: OutputOptions

    $: internal = recipient.type === 'account'
    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address

    async function _prepareOutput() {
        outputOptions = getOutputOptions(expirationDate, recipientAddress, rawAmount, metadata, tag)
        preparedOutput = await prepareOutput($selectedAccount.id, outputOptions, {
            remainderValueStrategy: {
                strategy: 'ReuseAddress',
                value: null,
            },
        })
        storageDeposit = calculateStorageDepositFromOutput(preparedOutput, rawAmount)
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

    function onBack(): void {
        closePopup()
        openPopup({
            type: 'sendForm',
            overflow: true,
            props: {
                asset,
                amount,
                unit,
                recipient,
                metadata,
                tag,
            },
        })
    }

    $: formattedFiatValue =
        formatCurrency(
            convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings?.currency])
        ) || '-'

    $: transactionDetails = {
        type: internal ? ActivityType.InternalTransaction : ActivityType.ExternalTransaction,
        inclusionState: InclusionState.Pending,
        direction: ActivityDirection.Out,
        amount: amount?.length > 0 ? amount : '0',
        unit,
        subject: recipient,
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
        <Button classes="w-full" secondary onClick={onBack}>{localize('actions.back')}</Button>
        <Button autofocus classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>

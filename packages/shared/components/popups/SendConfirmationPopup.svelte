<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, ExpirationTimePicker, KeyValueBox, Text, Error, Spinner } from 'shared/components'
    import { TransactionDetails } from 'shared/components/molecules'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import type { OutputTypes } from '@iota/types'
    import type { OutputOptions } from '@iota/wallet'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile, isLedgerProfile } from '@core/profile'
    import {
        ActivityDirection,
        ActivityType,
        calculateStorageDepositFromOutput,
        getOutputOptions,
        IAsset,
        InclusionState,
        Subject,
        sendOutput,
        validateSendConfirmation,
        generateRawAmount,
        selectedAccountAssets,
    } from '@core/wallet'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { closePopup, openPopup } from '@lib/popup'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { BaseError } from '@core/error'
    import { isTransferring } from '@lib/wallet'
    import { checkStronghold } from '@lib/stronghold'
    import { promptUserToConnectLedger } from '@lib/ledger'

    export let asset: IAsset
    export let amount = '0'
    export let recipient: Subject
    export let internal = false
    export let metadata: string
    export let tag: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let expirationDate: Date
    let storageDeposit = 0
    let preparedOutput: OutputTypes
    let outputOptions: OutputOptions
    let error: BaseError
    const unit = asset?.metadata?.unit

    $: asset = asset ?? $selectedAccountAssets?.baseCoin
    $: rawAmount = asset?.metadata ? generateRawAmount(amount, unit, asset.metadata) : Number(amount)
    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
    $: internal = recipient.type === 'account'

    $: $$props, expirationDate, rawAmount, void _prepareOutput()

    $: expirationDate, (error = null)
    $: formattedFiatValue =
        formatCurrency(
            convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings?.currency])
        ) || '-'

    $: transactionDetails = {
        asset,
        direction: ActivityDirection.Out,
        inclusionState: InclusionState.Pending,
        metadata,
        rawAmount,
        storageDeposit: storageDeposit,
        subject: recipient,
        tag,
        type: internal ? ActivityType.InternalTransaction : ActivityType.ExternalTransaction,
    }

    async function _prepareOutput(): Promise<void> {
        outputOptions = getOutputOptions(expirationDate, recipientAddress, rawAmount, metadata, tag, asset)
        preparedOutput = await prepareOutput($selectedAccount.id, outputOptions, {
            remainderValueStrategy: {
                strategy: 'ReuseAddress',
                value: null,
            },
        })
        storageDeposit = calculateStorageDepositFromOutput(preparedOutput, rawAmount)
    }

    async function validateAndSendOutput(): Promise<void> {
        validateSendConfirmation(outputOptions, preparedOutput)
        await sendOutput(preparedOutput)
        closePopup()
    }

    async function onConfirm(): Promise<void> {
        error = null
        try {
            if ($isSoftwareProfile) {
                await checkStronghold(validateAndSendOutput, true)
            } else if ($isLedgerProfile) {
                promptUserToConnectLedger(validateAndSendOutput, undefined, true)
            }
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error ?? err.message, logToConsole: true }) : err
            }
        }
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

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error, logToConsole: true }) : err
            }
        }
    })
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} {formattedFiatValue} />
        {#if storageDeposit !== undefined}
            <KeyValueBox keyText={localize('general.expirationTime')}>
                <ExpirationTimePicker
                    slot="value"
                    bind:value={expirationDate}
                    initialSelected={storageDeposit ? '1day' : 'none'}
                />
            </KeyValueBox>
        {/if}
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onBack} disabled={$isTransferring}
            >{localize('actions.back')}</Button
        >
        <Button autofocus classes="w-full" onClick={onConfirm} disabled={$isTransferring}>
            {#if $isTransferring}
                <Spinner busy classes="justify-center break-all" />
            {:else}
                {localize('actions.confirm')}
            {/if}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

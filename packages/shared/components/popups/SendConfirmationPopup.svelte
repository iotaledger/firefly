<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, ExpirationTimePicker, KeyValueBox, Text, Error, Spinner, Toggle } from 'shared/components'
    import { TransactionDetails } from 'shared/components/molecules'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import type { OutputTypes } from '@iota/types'
    import type { OutputOptions } from '@iota/wallet'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { ExpirationTime } from '@core/utils'
    import {
        ActivityDirection,
        ActivityType,
        getOutputOptions,
        InclusionState,
        sendOutput,
        validateSendConfirmation,
        convertToRawAmount,
        selectedAccountAssets,
        getStorageDepositFromOutput,
        DEFAULT_TRANSACTION_OPTIONS,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { closePopup, openPopup } from '@lib/popup'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { BaseError } from '@core/error'
    import { isTransferring } from '@lib/wallet'
    import { ledgerPreparedOutput } from '@core/ledger'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false

    const { asset, amount, unit, recipient, metadata, tag, disableChangeExpiration, disableToggleGift } =
        get(newTransactionDetails)
    let { expirationDate, giftStorageDeposit } = get(newTransactionDetails)

    let storageDeposit = 0
    let giftedStorageDeposit = 0
    let preparedOutput: OutputTypes
    let outputOptions: OutputOptions
    let error: BaseError

    const rawAmount = convertToRawAmount(amount, unit, asset.metadata)
    const initialExpirationDate = getInitialExpirationDate()

    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
    $: isInternal = recipient.type === 'account'
    $: isNativeToken = asset?.id !== $selectedAccountAssets?.baseCoin?.id

    $: expirationDate, void _prepareOutput()
    $: expirationDate, (error = null)

    $: formattedFiatValue =
        formatCurrency(
            convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings?.currency])
        ) || ''

    $: transactionDetails = {
        asset,
        direction: ActivityDirection.Out,
        inclusionState: InclusionState.Pending,
        metadata,
        rawAmount,
        storageDeposit: giftStorageDeposit ? giftedStorageDeposit : storageDeposit,
        subject: recipient,
        amount,
        tag,
        unit,
        isInternal,
        type: ActivityType.Transaction,
    }

    function getInitialExpirationDate(): ExpirationTime {
        if (expirationDate) {
            return ExpirationTime.Custom
        } else if (storageDeposit) {
            return ExpirationTime.OneDay
        } else {
            return ExpirationTime.None
        }
    }

    async function _prepareOutput(): Promise<void> {
        outputOptions = getOutputOptions(
            expirationDate,
            recipientAddress,
            rawAmount,
            metadata,
            tag,
            asset,
            giftStorageDeposit
        )
        preparedOutput = await prepareOutput($selectedAccount.id, outputOptions, DEFAULT_TRANSACTION_OPTIONS)
        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(preparedOutput)
        storageDeposit = _storageDeposit
        giftedStorageDeposit = _giftedStorageDeposit
    }

    async function validateAndSendOutput(): Promise<void> {
        validateSendConfirmation(outputOptions, preparedOutput)
        if ($isActiveLedgerProfile) {
            ledgerPreparedOutput.set(preparedOutput)
        }
        await sendOutput(preparedOutput)
        closePopup()
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function onConfirm(): Promise<void> {
        error = null
        try {
            updateNewTransactionDetails({ expirationDate, giftStorageDeposit })
            await checkActiveProfileAuth(validateAndSendOutput, { stronghold: true, ledger: false })
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
        })
    }

    function onCancel(): void {
        closePopup()
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
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <TransactionDetails {...transactionDetails} {formattedFiatValue} />
        {#if isNativeToken}
            <KeyValueBox keyText={localize('general.giftStorageDeposit')}>
                <Toggle
                    slot="value"
                    color="green"
                    disabled={disableToggleGift}
                    active={giftStorageDeposit}
                    onClick={toggleGiftStorageDeposit}
                />
            </KeyValueBox>
        {/if}
        {#if storageDeposit !== undefined}
            <KeyValueBox keyText={localize('general.expirationTime')}>
                <ExpirationTimePicker
                    slot="value"
                    bind:value={expirationDate}
                    initialSelected={initialExpirationDate}
                    disabled={disableChangeExpiration}
                />
            </KeyValueBox>
        {/if}
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        {#if disableBack}
            <Button classes="w-full" secondary onClick={onCancel} disabled={$isTransferring}>
                {localize('actions.cancel')}
            </Button>
        {:else}
            <Button classes="w-full" secondary onClick={onBack} disabled={$isTransferring}>
                {localize('actions.back')}
            </Button>
        {/if}

        <Button autofocus classes="w-full" onClick={onConfirm} disabled={$isTransferring}>
            {#if $isTransferring}
                <Spinner busy classes="justify-center break-all" />
            {:else}
                {localize('actions.confirm')}
            {/if}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

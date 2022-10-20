<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import Big from 'big.js'
    import {
        Button,
        ExpirationTimePicker,
        KeyValueBox,
        Text,
        TextHint,
        Error,
        Toggle,
        FontWeight,
        TextType,
    } from 'shared/components'
    import { TransactionDetails } from 'shared/components/molecules'
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
        selectedAccountAssets,
        DEFAULT_TRANSACTION_OPTIONS,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { BaseError } from '@core/error'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false

    const { asset, rawAmount, unit, recipient, metadata, tag, disableChangeExpiration, disableToggleGift, surplus } =
        get(newTransactionDetails)
    let { expirationDate, giftStorageDeposit } = get(newTransactionDetails)

    let storageDeposit = 0
    let giftedStorageDeposit = 0
    let preparedOutput: OutputTypes
    let outputOptions: OutputOptions
    let error: BaseError
    let expirationTimePicker: ExpirationTimePicker

    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()

    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
    $: isInternal = recipient.type === 'account'
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: hideGiftToggle = asset?.id === $selectedAccountAssets?.baseCoin?.id
    $: expirationDate, giftStorageDeposit, refreshSendConfirmationState()
    $: isTransferring = $selectedAccount.isTransferring

    function refreshSendConfirmationState(): void {
        error = null
        void _prepareOutput()
    }

    $: formattedFiatValue =
        formatCurrency(
            convertToFiat(
                Big(rawAmount),
                $currencies[CurrencyTypes.USD],
                $exchangeRates[$activeProfile?.settings?.currency]
            )
        ) || ''

    $: transactionDetails = {
        asset,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        metadata,
        storageDeposit: giftStorageDeposit ? giftedStorageDeposit : storageDeposit,
        subject: recipient,
        rawAmount,
        tag,
        unit,
        isInternal,
        surplus,
        type: ActivityType.Transaction,
    }

    function getInitialExpirationDate(): ExpirationTime {
        if (expirationDate) {
            return ExpirationTime.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
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
            giftStorageDeposit,
            surplus
        )
        preparedOutput = await prepareOutput($selectedAccount.index, outputOptions, DEFAULT_TRANSACTION_OPTIONS)
        setStorageDeposit(preparedOutput, Number(surplus))

        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
    }

    function setStorageDeposit(preparedOutput: OutputTypes, surplus?: number): void {
        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(preparedOutput)
        storageDeposit = _storageDeposit

        // Only giftedStorageDeposit needs adjusting, since that is derived
        // from the amount property instead of the unlock condition
        if (!surplus) {
            giftedStorageDeposit = _giftedStorageDeposit
        } else if (surplus >= _giftedStorageDeposit) {
            giftedStorageDeposit = 0
        } else {
            giftedStorageDeposit = _giftedStorageDeposit - surplus
        }
    }

    async function sendOutputAndClosePopup(): Promise<void> {
        await sendOutput(preparedOutput)
        closePopup()
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function onConfirm(): Promise<void> {
        error = null
        try {
            validateSendConfirmation(outputOptions, preparedOutput)
            updateNewTransactionDetails({ expirationDate, giftStorageDeposit, surplus })
            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
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
        {#if !hideGiftToggle}
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
        {#if initialExpirationDate !== undefined}
            <KeyValueBox keyText={localize('general.expirationTime')}>
                <ExpirationTimePicker
                    slot="value"
                    bind:this={expirationTimePicker}
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
    {#if surplus}
        <TextHint warning text={localize('popups.transaction.surplusIncluded')} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        {#if disableBack}
            <Button classes="w-full" outline onClick={onCancel} disabled={isTransferring}>
                {localize('actions.cancel')}
            </Button>
        {:else}
            <Button classes="w-full" outline onClick={onBack} disabled={isTransferring}>
                {localize('actions.back')}
            </Button>
        {/if}

        <Button classes="w-full" onClick={onConfirm} disabled={isTransferring} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

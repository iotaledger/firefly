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
        NftDetails,
        TransactionDetails,
    } from 'shared/components'
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
        getStorageDepositFromOutput,
        DEFAULT_TRANSACTION_OPTIONS,
        newTransactionDetails,
        updateNewTransactionDetails,
        NewTransactionType,
    } from '@core/wallet'
    import { formatCurrency } from '@core/i18n'
    import { currencies, Currency, exchangeRates, miotaToFiat } from '@core/utils'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { BaseError } from '@core/error'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { handleError } from '@core/error/handlers/handleError'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false
    export let tokenSend = false

    let { subject, expirationDate, giftStorageDeposit, surplus, disableChangeExpiration, disableToggleGift } =
        get(newTransactionDetails)

    let storageDeposit = 0
    let preparedOutput: OutputTypes
    let outputOptions: OutputOptions
    let error: BaseError
    let expirationTimePicker: ExpirationTimePicker

    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()

    $: transactionDetails = get(newTransactionDetails)
    $: recipientAddress = subject.type === 'account' ? subject.account.depositAddress : subject.address
    $: isInternal = subject.type === 'account'
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: hideGiftToggle =
        transactionDetails.type === NewTransactionType.TokenTransfer &&
        transactionDetails.asset?.id === $selectedAccountAssets?.baseCoin?.id
    $: expirationDate, giftStorageDeposit, refreshSendConfirmationState()
    $: isTransferring = $selectedAccount.isTransferring

    function refreshSendConfirmationState(): void {
        error = null
        void prepareTransactionOutput()
    }

    $: formattedFiatValue =
        transactionDetails.type === NewTransactionType.TokenTransfer
            ? formatCurrency(
                  miotaToFiat(
                      Big(transactionDetails.rawAmount),
                      $currencies[Currency.USD],
                      $exchangeRates[$activeProfile?.settings?.currency]
                  )
              )
            : ''

    function getInitialExpirationDate(): ExpirationTime {
        if (expirationDate) {
            return ExpirationTime.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
            return ExpirationTime.OneDay
        } else {
            return ExpirationTime.None
        }
    }

    async function prepareTransactionOutput(): Promise<void> {
        const transactionDetails = get(newTransactionDetails)
        outputOptions = getOutputOptions(
            expirationDate,
            recipientAddress,
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.rawAmount : '0',
            transactionDetails.metadata,
            transactionDetails.tag,
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.asset : undefined,
            giftStorageDeposit,
            transactionDetails.surplus,
            transactionDetails.type === NewTransactionType.NftTransfer ? transactionDetails.nftId : undefined
        )
        preparedOutput = await prepareOutput($selectedAccount.index, outputOptions, DEFAULT_TRANSACTION_OPTIONS)

        setStorageDeposit(preparedOutput, Number(transactionDetails.surplus))

        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
    }

    function setStorageDeposit(preparedOutput: OutputTypes, surplus?: number): void {
        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(preparedOutput)

        if (giftStorageDeposit) {
            // Only giftedStorageDeposit needs adjusting, since that is derived
            // from the amount property instead of the unlock condition
            if (!surplus) {
                storageDeposit = _giftedStorageDeposit
            } else if (surplus >= _giftedStorageDeposit) {
                storageDeposit = 0
            } else {
                storageDeposit = _giftedStorageDeposit - surplus
            }
        } else {
            storageDeposit = _storageDeposit
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

            updateNewTransactionDetails({ type: transactionDetails.type, expirationDate, giftStorageDeposit, surplus })
            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err?.error)
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
            handleError(err?.error)
        }
    })
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
        >{localize(tokenSend ? 'popups.transaction.title' : 'popups.sendNft.confirmationTitle')}</Text
    >
    <div class="w-full flex-col space-y-2">
        {#if transactionDetails.type === NewTransactionType.TokenTransfer}
            <TransactionDetails
                {...transactionDetails}
                {storageDeposit}
                {isInternal}
                {surplus}
                type={ActivityType.Transaction}
                direction={ActivityDirection.Outgoing}
                inclusionState={InclusionState.Pending}
                {formattedFiatValue}
            />
        {:else if transactionDetails.type === NewTransactionType.NftTransfer}
            <NftDetails
                {...transactionDetails}
                direction={ActivityDirection.Outgoing}
                inclusionState={InclusionState.Pending}
                {storageDeposit}
                {isInternal}
                type={ActivityType.Nft}
            />
        {/if}
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

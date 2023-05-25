<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import {
        Button,
        ExpirationTimePicker,
        KeyValueBox,
        Text,
        TextHint,
        Toggle,
        FontWeight,
        TextType,
        NftActivityDetails,
        BasicActivityDetails,
        ActivityInformation,
    } from 'shared/components'
    import { Tab } from 'shared/components/enums'
    import type { OutputOptions } from '@iota/wallet'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { ExpirationTime } from '@core/utils'
    import { ActivityDirection, ActivityType, InclusionState, ActivityAction } from '@core/wallet/enums'
    import {
        selectedAccountAssets,
        newTransactionDetails,
        updateNewTransactionDetails,
        NewTransactionType,
    } from '@core/wallet/stores'
    import { sendOutput } from '@core/wallet/actions'
    import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
    import { getOutputOptions, validateSendConfirmation, getAddressFromSubject } from '@core/wallet/utils'
    import { Output } from '@core/wallet/types'
    import { closeOverlay, openOverlay, PopupId } from '@auxiliary/popup'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import { handleError } from '@core/error/handlers/handleError'
    import {
        ACCOUNTS_CONTRACT,
        CONTRACT_FUNCTIONS,
        GAS_BUDGET,
        getDestinationNetworkFromAddress,
        TARGET_CONTRACTS,
        TRANSFER_ALLOWANCE,
    } from '@core/layer-2'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false

    let {
        recipient,
        expirationDate,
        giftStorageDeposit,
        surplus,
        disableChangeExpiration,
        disableToggleGift,
        layer2Parameters,
    } = get(newTransactionDetails)

    let storageDeposit = 0
    let visibleSurplus = 0
    let preparedOutput: Output
    let outputOptions: OutputOptions
    let expirationTimePicker: ExpirationTimePicker

    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()
    let activeTab: Tab

    $: transactionDetails = get(newTransactionDetails)
    $: isInternal = recipient.type === 'account'
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: hideGiftToggle =
        (transactionDetails.type === NewTransactionType.TokenTransfer &&
            transactionDetails.assetId === $selectedAccountAssets?.baseCoin?.id) ||
        (disableToggleGift && !giftStorageDeposit) ||
        !!layer2Parameters
    $: expirationDate, giftStorageDeposit, refreshSendConfirmationState()
    $: isTransferring = $selectedAccount.isTransferring

    $: activity = {
        ...transactionDetails,
        storageDeposit,
        subject: recipient,
        isInternal,
        giftedStorageDeposit: 0,
        surplus: visibleSurplus,
        type: ActivityType.Basic,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        action: ActivityAction.Send,
        destinationNetwork: getDestinationNetworkFromAddress(layer2Parameters?.networkAddress),
        ...(layer2Parameters?.networkAddress && {
            parsedLayer2Metadata: {
                ethereumAddress: getAddressFromSubject(recipient),
                targetContract: TARGET_CONTRACTS[ACCOUNTS_CONTRACT],
                contractFunction: CONTRACT_FUNCTIONS[TRANSFER_ALLOWANCE],
                gasBudget: GAS_BUDGET,
            },
        }),
    }

    function refreshSendConfirmationState(): void {
        updateNewTransactionDetails({ type: transactionDetails.type, expirationDate, giftStorageDeposit, surplus })
        void prepareTransactionOutput()
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

    async function prepareTransactionOutput(): Promise<void> {
        const transactionDetails = get(newTransactionDetails)

        outputOptions = getOutputOptions(transactionDetails)
        preparedOutput = await prepareOutput($selectedAccount.index, outputOptions, DEFAULT_TRANSACTION_OPTIONS)

        setStorageDeposit(preparedOutput, Number(surplus))

        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
    }

    function setStorageDeposit(preparedOutput: Output, surplus?: number): void {
        const rawAmount =
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.rawAmount : '0'

        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(preparedOutput, rawAmount)

        if (surplus > _storageDeposit) {
            visibleSurplus = Number(surplus)
        }

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
        closeOverlay()
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function onConfirmClick(): Promise<void> {
        try {
            validateSendConfirmation(outputOptions, preparedOutput)

            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closeOverlay()
        openOverlay({
            id: PopupId.SendForm,
            overflow: true,
        })
    }

    function onCancelClick(): void {
        closeOverlay()
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        {#if transactionDetails.type === NewTransactionType.TokenTransfer}
            <BasicActivityDetails {activity} />
        {:else if transactionDetails.type === NewTransactionType.NftTransfer}
            <NftActivityDetails {activity} />
        {/if}
        <div class="pt-4">
            <ActivityInformation {activity} bind:activeTab />
        </div>
        {#if activeTab === Tab.Transaction}
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
                        disabled={disableChangeExpiration || isTransferring}
                    />
                </KeyValueBox>
            {/if}
        {/if}
    </div>
    {#if surplus}
        <TextHint warning text={localize('popups.transaction.surplusIncluded')} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        {#if disableBack}
            <Button classes="w-full" outline onClick={onCancelClick} disabled={isTransferring}>
                {localize('actions.cancel')}
            </Button>
        {:else}
            <Button classes="w-full" outline onClick={onBackClick} disabled={isTransferring}>
                {localize('actions.back')}
            </Button>
        {/if}

        <Button classes="w-full" onClick={onConfirmClick} disabled={isTransferring} isBusy={isTransferring}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

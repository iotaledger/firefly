<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { ledgerPreparedOutput } from '@core/ledger/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { isActiveLedgerProfile } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { TimePeriod } from '@core/utils/enums'
    import { sendOutput } from '@core/wallet/actions'
    import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
    import {
        NewTransactionType,
        newTransactionDetails,
        selectedAccountAssets,
        updateNewTransactionDetails,
    } from '@core/wallet/stores'
    import { Output } from '@core/wallet/types'
    import { getOutputParameters, getStorageDepositFromOutput, validateSendConfirmation } from '@core/wallet/utils'
    import type { OutputParams } from '@iota/wallet'
    import { AddInputButton, ExpirationTimePicker, OptionalInput } from '@ui'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import TokenAmountTile from './components/TokenAmountTile.svelte'
    import TransactionDetails from './components/TransactionDetails.svelte'
    import { NetworkId } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let {
        expirationDate,
        timelockDate,
        disableChangeExpiration,
        giftStorageDeposit,
        surplus,
        layer2Parameters,
        tag,
        metadata,
        disableToggleGift,
    } = get(newTransactionDetails)

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    let storageDeposit = 0
    let visibleSurplus = 0
    let preparedOutput: Output
    let outputParams: OutputParams
    let expirationTimePicker: ExpirationTimePicker
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: transactionDetails = get(newTransactionDetails)
    $: recipient =
        transactionDetails.recipient.type === 'account'
            ? transactionDetails.recipient.account.name
            : truncateString(transactionDetails.recipient?.address, 6, 6)
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: expirationDate, timelockDate, giftStorageDeposit, refreshSendConfirmationState()
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isLayer2 = !!layer2Parameters?.networkAddress

    function refreshSendConfirmationState(): void {
        updateNewTransactionDetails({
            type: transactionDetails.type,
            expirationDate,
            timelockDate,
            giftStorageDeposit,
            surplus,
        })
        void prepareTransactionOutput()
    }

    function getInitialExpirationDate(): TimePeriod {
        if (expirationDate) {
            return TimePeriod.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
            return TimePeriod.OneDay
        } else {
            return TimePeriod.None
        }
    }

    async function calculateInitialOutput() {
        await prepareTransactionOutput()
        selectedExpirationPeriod = getInitialExpirationDate()
    }

    async function prepareTransactionOutput(): Promise<void> {
        const transactionDetails = get(newTransactionDetails)

        outputParams = getOutputParameters(transactionDetails)
        preparedOutput = await prepareOutput($selectedAccount.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)

        setStorageDeposit(preparedOutput, Number(surplus))
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
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            validateSendConfirmation(outputParams, preparedOutput)

            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        $sendFlowRouter.previous()
    }

    onMount(async () => {
        try {
            await calculateInitialOutput()
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<SendFlowTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient } })}
    leftButton={{ text: localize('actions.back'), onClick: onBackClick }}
    rightButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
        isBusy: isTransferring,
    }}
>
    <div class="flex flex-row gap-2 justify-between">
        {#if transactionDetails.type === NewTransactionType.TokenTransfer}
            <TokenAmountTile asset={transactionDetails.asset} amount={transactionDetails.rawAmount} />
        {/if}
        {#if visibleSurplus}
            <!-- TODO: replace Testnet with the profile network -->
            <TokenAmountTile
                asset={$selectedAccountAssets?.[NetworkId.Testnet]?.baseCoin}
                amount={String(visibleSurplus)}
                showAssetInfo={false}
            />
        {/if}
    </div>

    <TransactionDetails
        bind:expirationDate
        bind:timelockDate
        bind:selectedExpirationPeriod
        bind:selectedTimelockPeriod
        bind:giftStorageDeposit
        {storageDeposit}
        {destinationNetwork}
        {disableChangeExpiration}
        disableChangeTimelock={disableChangeExpiration}
        disableGiftStorageDeposit={disableToggleGift}
        disableAll={isTransferring}
    />

    <optional-inputs class="flex flex-row flex-wrap gap-4">
        <AddInputButton
            open={!!selectedExpirationPeriod}
            text={localize('general.expirationTime')}
            onClick={() => (selectedExpirationPeriod = TimePeriod.OneDay)}
        />
        <AddInputButton
            open={!!selectedTimelockPeriod}
            text={localize('general.timelockDate')}
            onClick={() => (selectedTimelockPeriod = TimePeriod.OneDay)}
        />
        <OptionalInput
            bind:this={tagInput}
            bind:value={tag}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
        />
        {#if !isLayer2}
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
        {/if}
    </optional-inputs>
</SendFlowTemplate>

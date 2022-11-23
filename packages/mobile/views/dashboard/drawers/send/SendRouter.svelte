<script lang="typescript">
    import { prepareOutput, selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { isActiveLedgerProfile } from '@core/profile'
    import { ExpirationTime } from '@core/utils'
    import {
        DEFAULT_TRANSACTION_OPTIONS,
        getOutputOptions,
        newTransactionDetails,
        NewTransactionType,
        Output,
        sendOutput,
        updateNewTransactionDetails,
        validateSendConfirmation,
    } from '@core/wallet'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import type { OutputOptions } from '@iota/wallet'
    import { ExpirationTimePicker } from 'shared/components'
    import { get } from 'svelte/store'
    import { StrongholdUnlock } from '../../../../components'
    import { sendRoute, SendRoute, sendRouter } from '../../../../lib/routers'
    import { AmountView, ConfirmView, RecipientView, TokenView } from './views'

    $: ({ recipient, expirationDate, giftStorageDeposit, surplus } = $newTransactionDetails)

    export let onClose: () => unknown = () => {}

    let storageDeposit = 0
    let preparedOutput: Output
    let outputOptions: OutputOptions
    let expirationTimePicker: ExpirationTimePicker
    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()

    let submitSendOnMount: boolean = false

    $: transactionDetails = get(newTransactionDetails)
    $: recipientAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    $: expirationTimePicker?.setNull(giftStorageDeposit)

    async function onSend(): Promise<void> {
        try {
            await prepareTransactionOutput()
            validateSendConfirmation(outputOptions, preparedOutput)

            updateNewTransactionDetails({ type: transactionDetails.type, expirationDate, giftStorageDeposit, surplus })
            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }
            await sendOutput(preparedOutput)
            onClose && onClose()
        } catch (err) {
            handleError(err)
        }
    }

    async function prepareTransactionOutput(): Promise<void> {
        const transactionDetails = get(newTransactionDetails)
        // TODO: move arguments into transactionDetails object
        outputOptions = getOutputOptions(
            expirationDate,
            recipientAddress,
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.rawAmount : '0',
            transactionDetails.metadata,
            transactionDetails.tag,
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.asset : undefined,
            giftStorageDeposit,
            transactionDetails.surplus,
            transactionDetails.layer2Parameters,
            transactionDetails.type === NewTransactionType.NftTransfer ? transactionDetails.nftId : undefined
        )
        preparedOutput = await prepareOutput($selectedAccount.index, outputOptions, DEFAULT_TRANSACTION_OPTIONS)

        setStorageDeposit(preparedOutput, Number(surplus))

        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
    }

    function setStorageDeposit(preparedOutput: Output, surplus?: number): void {
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

    function getInitialExpirationDate(): ExpirationTime {
        if (expirationDate) {
            return ExpirationTime.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
            return ExpirationTime.OneDay
        } else {
            return ExpirationTime.None
        }
    }

    function onUnlockSuccess(): void {
        submitSendOnMount = true
        $sendRouter.next()
    }
</script>

{#if $sendRoute === SendRoute.Token}
    <TokenView />
{:else if $sendRoute === SendRoute.Recipient}
    <RecipientView />
{:else if $sendRoute === SendRoute.Amount}
    <AmountView {onSend} {submitSendOnMount} />
{:else if $sendRoute === SendRoute.Confirm}
    <ConfirmView />
{:else if $sendRoute === SendRoute.Password}
    <StrongholdUnlock onSuccess={onUnlockSuccess} onCancel={() => $sendRouter.previous()} />
{/if}

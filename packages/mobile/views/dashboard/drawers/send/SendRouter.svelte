<script lang="typescript">
    import { prepareOutput, selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { isActiveLedgerProfile } from '@core/profile'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { ExpirationTime } from '@core/utils'
    import {
        DEFAULT_TRANSACTION_OPTIONS,
        getAssetById,
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
    import { AmountView, RecipientView, ReferenceView, ReviewView, TokenView } from './views'

    $: ({ recipient, expirationDate, giftStorageDeposit, surplus } = $newTransactionDetails)

    let storageDeposit = 0
    let preparedOutput: Output
    let outputOptions: OutputOptions
    let expirationTimePicker: ExpirationTimePicker
    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()

    let triggerSendOnMount: boolean = false

    $: transactionDetails = get(newTransactionDetails)
    $: recipientAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: asset =
        transactionDetails.type === NewTransactionType.TokenTransfer
            ? getAssetById(transactionDetails.assetId)
            : undefined

    async function sendTransaction(): Promise<void> {
        triggerSendOnMount = false
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            try {
                await prepareTransactionOutput()
                validateSendConfirmation(outputOptions, preparedOutput)

                updateNewTransactionDetails({
                    type: $newTransactionDetails.type,
                    expirationDate,
                    giftStorageDeposit,
                    surplus,
                })
                if ($isActiveLedgerProfile) {
                    ledgerPreparedOutput.set(preparedOutput)
                }
                await sendOutput(preparedOutput)
                $sendRouter.next()
            } catch (err) {
                handleError(err)
                throw new Error(err)
            }
        } else {
            $sendRouter.next({ needsUnlock: true })
        }
    }

    async function prepareTransactionOutput(): Promise<void> {
        // TODO: move arguments into transactionDetails object
        outputOptions = getOutputOptions(
            expirationDate,
            recipientAddress,
            $newTransactionDetails.type === NewTransactionType.TokenTransfer ? $newTransactionDetails.rawAmount : '0',
            $newTransactionDetails.metadata,
            $newTransactionDetails.tag,
            asset,
            giftStorageDeposit,
            $newTransactionDetails.surplus,
            $newTransactionDetails.layer2Parameters,
            $newTransactionDetails.type === NewTransactionType.NftTransfer ? $newTransactionDetails.nftId : undefined
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
        triggerSendOnMount = true
        $sendRouter.next()
    }
</script>

{#if $sendRoute === SendRoute.Token}
    <TokenView />
{:else if $sendRoute === SendRoute.Recipient}
    <RecipientView />
{:else if $sendRoute === SendRoute.Amount}
    <AmountView />
{:else if $sendRoute === SendRoute.Reference}
    <ReferenceView />
{:else if $sendRoute === SendRoute.Review}
    <ReviewView {sendTransaction} {triggerSendOnMount} {storageDeposit} />
{:else if $sendRoute === SendRoute.Password}
    <StrongholdUnlock onSuccess={onUnlockSuccess} onCancel={() => $sendRouter.previous()} />
{/if}

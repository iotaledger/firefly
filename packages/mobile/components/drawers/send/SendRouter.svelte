<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { AmountView, RecipientView, ReviewView, TokenView } from './views'

    import { prepareOutput, selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { isActiveLedgerProfile } from '@core/profile'
    import { TimePeriod } from '@core/utils'
    import {
        DEFAULT_TRANSACTION_OPTIONS,
        getOutputParameters,
        newTransactionDetails,
        NewTransactionType,
        sendOutput,
        updateNewTransactionDetails,
        validateSendConfirmation,
    } from '@core/wallet'
    import { CommonOutput, Output } from '@iota/sdk/out/types'

    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'

    import { sendRoute, SendRoute, sendRouter } from '@/routers'

    $: ({ expirationDate, giftStorageDeposit, surplus } = $newTransactionDetails)

    let storageDeposit = 0
    let visibleSurplus = 0
    let preparedOutput: Output
    let initialExpirationDate = getInitialExpirationDate()

    $: transactionDetails = get(newTransactionDetails)
    $: expirationDate, giftStorageDeposit, refreshSendConfirmationState()

    onMount(() => {
        if (transactionDetails.type === NewTransactionType.TokenTransfer && transactionDetails.asset) {
            $sendRouter.next()
        }
    })

    async function sendTransaction(): Promise<void> {
        try {
            await prepareTransactionOutput()
            validateSendConfirmation($selectedAccount, preparedOutput as CommonOutput)

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
    }

    async function prepareTransactionOutput(): Promise<void> {
        if (!transactionDetails.recipient) {
            return
        }
        const outputParams = await getOutputParameters(transactionDetails)
        preparedOutput = await prepareOutput($selectedAccount.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)
        await setStorageDeposit(preparedOutput, Number(surplus))
        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
    }

    async function setStorageDeposit(preparedOutput: Output, surplus?: number): Promise<void> {
        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            await getStorageDepositFromOutput($selectedAccount, preparedOutput as CommonOutput)
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

    function refreshSendConfirmationState(): void {
        updateNewTransactionDetails({ type: transactionDetails.type, expirationDate, giftStorageDeposit, surplus })
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
</script>

{#if $sendRoute === SendRoute.Token}
    <TokenView />
{:else if $sendRoute === SendRoute.Recipient}
    <RecipientView />
{:else if $sendRoute === SendRoute.Amount}
    <AmountView />
{:else if $sendRoute === SendRoute.Review}
    <ReviewView {sendTransaction} {storageDeposit} {initialExpirationDate} bind:expirationDate bind:visibleSurplus />
{/if}

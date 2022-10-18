<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, ExpirationTimePicker, KeyValueBox, Text, FontWeight, TextType } from 'shared/components'
    import { NftDetails } from 'shared/components/molecules'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { ExpirationTime } from '@core/utils'
    import {
        ActivityDirection,
        ActivityType,
        InclusionState,
        newNftTransactionDetails,
        updateNewNftTransactionDetails,
        sendNft,
        buildNftOutputData,
    } from '@core/wallet'
    import { closePopup, openPopup } from '@lib/popup'
    import { handleError } from '@core/error/handlers/handleError'
    import type { INftOutput } from '@iota/types'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false

    const { nftId, recipient } = get(newNftTransactionDetails)
    let { expirationDate } = get(newNftTransactionDetails)

    let storageDeposit = 0
    let preparedOutput: INftOutput
    let expirationTimePicker: ExpirationTimePicker

    let initialExpirationDate: ExpirationTime = getInitialExpirationDate()

    $: recipientAddress = recipient.type === 'account' ? recipient.account.depositAddress : recipient.address
    $: isInternal = recipient.type === 'account'
    $: isTransferring = $selectedAccount.isTransferring
    $: expirationDate, refreshSendConfirmationState()

    $: transactionDetails = {
        nftId,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        storageDeposit,
        subject: recipient,
        isInternal,
        type: ActivityType.Nft,
    }

    function refreshSendConfirmationState(): void {
        void _prepareOutput()
    }

    async function _prepareOutput(): Promise<void> {
        const outputData = buildNftOutputData(expirationDate, nftId, recipientAddress, $selectedAccount.depositAddress)
        preparedOutput = await $selectedAccount.buildNftOutput(outputData)
        storageDeposit = Number(preparedOutput.amount)

        if (!initialExpirationDate) {
            initialExpirationDate = getInitialExpirationDate()
        }
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

    async function sendOutputAndClosePopup(): Promise<void> {
        await sendNft(preparedOutput)
        closePopup()
    }

    async function onConfirm(): Promise<void> {
        try {
            updateNewNftTransactionDetails({ expirationDate })
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
        } catch (err) {
            console.error(err)
            handleError(err.error)
        }
    }

    function onBack(): void {
        closePopup()
        openPopup({
            type: 'sendNftForm',
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
        >{localize('popups.sendNft.confirmationTitle')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <NftDetails {...transactionDetails} />
        {#if initialExpirationDate !== undefined}
            <KeyValueBox keyText={localize('general.expirationTime')}>
                <ExpirationTimePicker
                    slot="value"
                    bind:this={expirationTimePicker}
                    bind:value={expirationDate}
                    initialSelected={initialExpirationDate}
                />
            </KeyValueBox>
        {/if}
    </div>
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

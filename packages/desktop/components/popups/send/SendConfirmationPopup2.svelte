<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { FontWeight, Tab, TextHintVariant, TextType } from 'shared/components/enums'
    import {
        ActivityInformation,
        BasicActivityDetails,
        Button,
        ExpirationTimePicker,
        KeyValueBox,
        NftActivityDetails,
        Text,
        TextHint,
        Toggle,
    } from '@ui'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { TimePeriod } from '@core/utils'
    import { TokenStandard } from '@core/wallet/enums'
    import { newTransactionDetails, NewTransactionType, updateNewTransactionDetails } from '@core/wallet/stores'
    import { sendOutput } from '@core/wallet/actions'
    import {
        validateSendConfirmation,
        getStorageDepositFromOutput,
        getOutputParameters,
        getDefaultTransactionOptions,
    } from '@core/wallet/utils'
    import { closePopup, openPopup, PopupId, updatePopupProps } from '@auxiliary/popup'
    import { NewTokenTransactionDetails, NftActivity, TransactionActivity, VestingActivity } from '@core/wallet/types'
    import { CommonOutput, Output } from '@iota/sdk/out/types'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { handleError } from '@core/error/handlers/handleError'
    import { ToggleColor } from '@ui/inputs/Toggle.svelte'
    import { getInitialExpirationDate, rebuildActivity } from '@core/wallet/utils/send/sendUtils'

    export let disableBack = false
    export let isSendAndClosePopup: boolean = false
    export let preparedOutput: Output
    export let calculatedStorageDeposit: number = 0

    const transactionDetails = get(newTransactionDetails)
    const {
        type: transactionType,
        recipient,
        layer2Parameters,
        disableToggleGift,
        disableChangeExpiration,
    } = get(newTransactionDetails)

    let { surplus, expirationDate, giftStorageDeposit } = get(newTransactionDetails)

    let activeTab: Tab
    let activity: TransactionActivity | VestingActivity | NftActivity | undefined = undefined
    let expirationTimePicker: ExpirationTimePicker
    let initialExpirationDate: TimePeriod

    let storageDeposit = calculatedStorageDeposit
    let minimumStorageDeposit = 0
    let visibleSurplus: number | undefined = undefined

    $: expirationTimePicker?.setNull(giftStorageDeposit)

    $: isBaseTokenTransfer =
        transactionDetails.type === NewTransactionType.TokenTransfer &&
        transactionDetails.asset?.metadata?.standard === TokenStandard.BaseToken
    $: isInternal = recipient.type === 'account'
    $: isTransferring = $selectedAccount.isTransferring
    $: hideGiftToggle = isBaseTokenTransfer || !!layer2Parameters || (disableToggleGift && !giftStorageDeposit)

    $: if (!isSendAndClosePopup) expirationDate, giftStorageDeposit, void rebuildTransactionOutput()

    $: activity = rebuildActivity(
        transactionDetails,
        recipient,
        storageDeposit,
        giftStorageDeposit,
        visibleSurplus,
        isInternal,
        layer2Parameters
    )

    onMount(() => {
        void updateStorageDeposit()
    })

    async function rebuildTransactionOutput(): Promise<void> {
        updateNewTransactionDetails({
            type: transactionType,
            expirationDate,
            giftStorageDeposit,
        })

        try {
            const transactionDetails = get(newTransactionDetails)
            const outputParams = await getOutputParameters(transactionDetails)
            preparedOutput = await prepareOutput($selectedAccount.index, outputParams, getDefaultTransactionOptions())

            await updateStorageDeposit()

            if (transactionDetails.expirationDate === undefined) {
                initialExpirationDate = getInitialExpirationDate(expirationDate, storageDeposit, giftStorageDeposit)
            }
        } catch (err) {
            handleError(err)
        }
    }

    async function updateStorageDeposit(): Promise<void> {
        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            await getStorageDepositFromOutput($selectedAccount, preparedOutput as CommonOutput)

        storageDeposit = minimumStorageDeposit = _storageDeposit > 0 ? _storageDeposit : _giftedStorageDeposit

        if (isBaseTokenTransfer) {
            const rawAmount = Number((transactionDetails as NewTokenTransactionDetails).rawAmount)
            if (rawAmount >= storageDeposit) {
                storageDeposit = 0
            }
        }

        // Note: we need to adjust the surplus
        // so we make sure that the surplus is always added on top of the minimum storage deposit
        if (Number(surplus) > 0) {
            if (minimumStorageDeposit >= Number(surplus)) {
                visibleSurplus = surplus = undefined
            } else {
                visibleSurplus = Number(surplus) - minimumStorageDeposit
                // Note: we have to hide it because currently, in the sdk,
                // the storage deposit return strategy is only looked at
                // if the provided amount is < the minimum required storage deposit
                hideGiftToggle = true
            }
        }
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function sendOutputAndClosePopup(): Promise<void> {
        await sendOutput(preparedOutput)
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            validateSendConfirmation(preparedOutput as CommonOutput)

            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }

            updatePopupProps({ isSendAndClosePopup: true, preparedOutput, calculatedStorageDeposit: storageDeposit })
            await checkActiveProfileAuth(sendOutputAndClosePopup, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.SendForm,
            overflow: true,
        })
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
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
                        color={ToggleColor.Green}
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
        <TextHint variant={TextHintVariant.Warning} text={localize('popups.transaction.surplusIncluded')} />
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

        <Button
            classes="w-full"
            onClick={onConfirmClick}
            disabled={isTransferring ||
                (layer2Parameters?.networkAddress && !$newTransactionDetails?.layer2Parameters?.gasBudget)}
            isBusy={isTransferring ||
                (layer2Parameters?.networkAddress && !$newTransactionDetails?.layer2Parameters?.gasBudget)}
        >
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

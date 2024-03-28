<script lang="ts">
    import { PopupId, closePopup, openPopup, updatePopupProps } from '@auxiliary/popup'
    import { prepareOutput, selectedWallet } from '@core/wallet'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { TimePeriod } from '@core/utils'
    import { sendOutput } from '@core/wallet/actions'
    import { SubjectType, TokenStandard } from '@core/wallet/enums'
    import { NewTransactionType, newTransactionDetails, updateNewTransactionDetails } from '@core/wallet/stores'
    import { NewTokenTransactionDetails, NftActivity, TransactionActivity, VestingActivity } from '@core/wallet/types'
    import {
        getDefaultTransactionOptions,
        getOutputParameters,
        getStorageDepositFromOutput,
        validateSendConfirmation,
    } from '@core/wallet/utils'
    import { getInitialExpirationDate, rebuildActivity } from '@core/wallet/utils/send/sendUtils'
    import { CommonOutput, Output } from '@iota/sdk/out/types'
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
    import { ToggleColor } from '@ui/inputs/Toggle.svelte'
    import { FontWeight, Tab, TextHintVariant, TextType } from '@ui/enums'
    import { ManaBox } from '@components'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let isSendAndClosePopup: boolean = false
    export let disableBack = false
    export let preparedOutput: Output

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
    let activity: Partial<TransactionActivity | VestingActivity | NftActivity> | undefined = undefined
    let expirationTimePicker: ExpirationTimePicker
    let initialExpirationDate: TimePeriod

    let storageDeposit: number = 0
    let minimumStorageDeposit = 0
    let visibleSurplus: number | undefined = undefined

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    let isPreparingOutput = false
    $: expirationTimePicker?.setNull(giftStorageDeposit)

    $: isBaseTokenTransfer =
        transactionDetails.type === NewTransactionType.TokenTransfer &&
        transactionDetails.asset?.metadata?.standard === TokenStandard.BaseToken
    $: isInternal = recipient.type === SubjectType.Wallet
    $: isLayer2Transaction = !!layer2Parameters
    $: isTransferring = $selectedWallet?.isTransferring
    $: hideGiftToggle = isBaseTokenTransfer || isLayer2Transaction || (disableToggleGift && !giftStorageDeposit)

    $: if (!isSendAndClosePopup) expirationDate, giftStorageDeposit, void rebuildTransactionOutput()

    $: activity = rebuildActivity(
        transactionDetails,
        recipient,
        storageDeposit,
        visibleSurplus,
        isInternal,
        layer2Parameters
    )

    onMount(async () => {
        await updateStorageDeposit()

        try {
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareSendOutputs(
                [preparedOutput],
                getDefaultTransactionOptions()
            )
        } catch (error) {
            transactionInfo.preparedTransactionError = error
        }

        if (isSendAndClosePopup || expirationDate) {
            // Needed after 'return from stronghold' to SHOW to correct expiration date before output is sent
            initialExpirationDate = getInitialExpirationDate(
                expirationDate,
                storageDeposit,
                giftStorageDeposit,
                isLayer2Transaction
            )

            try {
                await _onMount()
            } catch (err) {
                handleError(err)
            }
        }
    })

    async function rebuildTransactionOutput(): Promise<void> {
        isPreparingOutput = true

        updateNewTransactionDetails({
            type: transactionType,
            expirationDate,
            giftStorageDeposit,
        })

        try {
            const transactionDetails = get(newTransactionDetails)
            const outputParams = await getOutputParameters(transactionDetails)
            preparedOutput = await prepareOutput($selectedWallet?.id, outputParams, getDefaultTransactionOptions())
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareSendOutputs(
                [preparedOutput],
                getDefaultTransactionOptions()
            )
            await updateStorageDeposit()

            // This potentially triggers a second 'prepareOutput',
            // as it updates expiration date through the ExpirationTimePicker bind
            // Could be avoided with a rework of ExpirationTimePicker
            if (transactionDetails.expirationDate === undefined) {
                initialExpirationDate = getInitialExpirationDate(
                    expirationDate,
                    storageDeposit,
                    giftStorageDeposit,
                    isLayer2Transaction
                )
            }
        } catch (err) {
            handleError(err)
            transactionInfo.preparedTransactionError = err
        } finally {
            isPreparingOutput = false
        }
    }

    async function updateStorageDeposit(): Promise<void> {
        if (preparedOutput) {
            const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
                await getStorageDepositFromOutput(preparedOutput as CommonOutput)

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
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function sendOutputAndClosePopup(): Promise<void> {
        try {
            await sendOutput(preparedOutput)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            // make sure to close the popup if the user is using a ledger device
            if ($isActiveLedgerProfile) {
                closePopup(true)
            }
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            validateSendConfirmation(preparedOutput as CommonOutput)

            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }

            updatePopupProps({ isSendAndClosePopup: true, preparedOutput })
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

    $: hasMainAccountNegativeBIC = $selectedWallet?.balances?.blockIssuanceCredits?.[$selectedWallet?.mainAccountId] < 0
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
            <ManaBox {transactionInfo} bind:hasEnoughMana />
        {/if}
    </div>
    {#if surplus}
        <TextHint variant={TextHintVariant.Warning} text={localize('popups.transaction.surplusIncluded')} />
    {/if}
    {#if hasMainAccountNegativeBIC}
        <TextHint variant={TextHintVariant.Danger} text={localize('popups.transaction.negativeBIC')} />
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
                hasMainAccountNegativeBIC ||
                isPreparingOutput ||
                !hasEnoughMana ||
                (layer2Parameters?.networkAddress && !$newTransactionDetails?.layer2Parameters?.gasBudget)}
            isBusy={isTransferring ||
                isPreparingOutput ||
                (layer2Parameters?.networkAddress && !$newTransactionDetails?.layer2Parameters?.gasBudget)}
            busyMessage={isPreparingOutput ? 'Preparing' : ''}
        >
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>

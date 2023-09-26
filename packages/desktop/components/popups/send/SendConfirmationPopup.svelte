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
    import { Tab, TextHintVariant } from 'shared/components/enums'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { TimePeriod } from '@core/utils'
    import { ActivityDirection, ActivityType, InclusionState, ActivityAction, TokenStandard } from '@core/wallet/enums'
    import { newTransactionDetails, updateNewTransactionDetails, NewTransactionType } from '@core/wallet/stores'
    import { sendOutput } from '@core/wallet/actions'
    import {
        getOutputParameters,
        validateSendConfirmation,
        getAddressFromSubject,
        getDefaultTransactionOptions,
    } from '@core/wallet/utils'
    import { closePopup, openPopup, PopupId, updatePopupProps } from '@auxiliary/popup'
    import { Activity, NewTokenTransactionDetails } from '@core/wallet/types'
    import { CommonOutput, Output } from '@iota/sdk/out/types'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { getStorageDepositFromOutput } from '@core/wallet/utils/generateActivity/helper'
    import { handleError } from '@core/error/handlers/handleError'
    import {
        ACCOUNTS_CONTRACT,
        CONTRACT_FUNCTIONS,
        getDestinationNetworkFromAddress,
        TARGET_CONTRACTS,
        TRANSFER_ALLOWANCE,
    } from '@core/layer-2'
    import { ToggleColor } from '@ui/inputs/Toggle.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false
    export let isCallbackFromUnlockStronghold: boolean = false

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
    let minimumStorageDeposit = 0
    let preparedOutput: Output
    let expirationTimePicker: ExpirationTimePicker
    let visibleSurplus: number | undefined = undefined

    let initialExpirationDate: TimePeriod
    let activeTab: Tab

    $: transactionDetails = get(newTransactionDetails)
    $: isInternal = recipient.type === 'account'
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: isBaseTokenTransfer =
        transactionDetails.type === NewTransactionType.TokenTransfer &&
        transactionDetails.asset?.metadata?.standard === TokenStandard.BaseToken
    $: hideGiftToggle = isBaseTokenTransfer || !!layer2Parameters || (disableToggleGift && !giftStorageDeposit)
    $: expirationDate, giftStorageDeposit, refreshSendConfirmationState()
    $: isTransferring = $selectedAccount.isTransferring

    let activity: Activity | undefined = undefined
    $: activity = {
        ...transactionDetails,
        assetId: transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.asset.id : undefined,
        storageDeposit,
        subject: recipient,
        isInternal,
        id: undefined,
        outputId: undefined,
        transactionId: undefined,
        time: undefined,
        containsValue: true,
        isAssetHidden: false,
        asyncData: undefined,
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
                gasBudget: layer2Parameters?.gasBudget ?? 0,
            },
        }),
    }

    function refreshSendConfirmationState(): void {
        if (!isCallbackFromUnlockStronghold) {
            if (
                transactionDetails.type === NewTransactionType.NftTransfer &&
                Number($selectedAccount.balances.baseCoin.available) === 0
            ) {
                giftStorageDeposit = true
                disableChangeExpiration = true
                disableToggleGift = true
            }
            updateNewTransactionDetails({ type: transactionDetails.type, expirationDate, giftStorageDeposit, surplus })
            void prepareTransactionOutput()
        } else {
            initialExpirationDate = getInitialExpirationDate()
        }
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

    async function prepareTransactionOutput(): Promise<void> {
        try {
            const transactionDetails = get(newTransactionDetails)
            const outputParams = await getOutputParameters(transactionDetails)
            preparedOutput = await prepareOutput($selectedAccount.index, outputParams, getDefaultTransactionOptions())

            await updateStorageDeposit()

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

            if (transactionDetails.expirationDate === undefined) {
                initialExpirationDate = getInitialExpirationDate()
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
    }

    async function sendOutputAndClosePopup(): Promise<void> {
        await sendOutput(preparedOutput)
        closePopup()
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    async function onConfirmClick(): Promise<void> {
        try {
            validateSendConfirmation(preparedOutput as CommonOutput)

            if ($isActiveLedgerProfile) {
                ledgerPreparedOutput.set(preparedOutput)
            }

            updatePopupProps({ isCallbackFromUnlockStronghold: true })
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

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
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

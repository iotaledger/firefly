<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import {
        Button,
        ExpirationTimePicker,
        KeyValueBox,
        Text,
        TextHint,
        FontWeight,
        TextType,
        NftActivityDetails,
        BasicActivityDetails,
        ActivityInformation,
    } from 'shared/components'
    import { Tab, TextHintVariant } from 'shared/components/enums'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { TimePeriod } from '@core/utils'
    import { ActivityDirection, ActivityType, InclusionState, ActivityAction } from '@core/wallet/enums'
    import { newTransactionDetails, NewTransactionType } from '@core/wallet/stores'
    import { sendOutput } from '@core/wallet/actions'
    import {
        validateSendConfirmation,
        getAddressFromSubject,
    } from '@core/wallet/utils'
    import { closePopup, openPopup, PopupId, updatePopupProps } from '@auxiliary/popup'
    import { Activity } from '@core/wallet/types'
    import { CommonOutput, Output } from '@iota/sdk/out/types'
    import { ledgerPreparedOutput } from '@core/ledger'
    import { handleError } from '@core/error/handlers/handleError'
    import {
        ACCOUNTS_CONTRACT,
        CONTRACT_FUNCTIONS,
        getDestinationNetworkFromAddress,
        TARGET_CONTRACTS,
        TRANSFER_ALLOWANCE,
    } from '@core/layer-2'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let disableBack = false
    export let storageDeposit: number
    export let visibleSurplus: number
    export let preparedOutput: Output

    const {
        recipient,
        expirationDate,
        giftStorageDeposit,
        surplus,
        layer2Parameters,
    } = get(newTransactionDetails)

    $: console.log('prepared:', preparedOutput)

    let expirationTimePicker: ExpirationTimePicker

    let initialExpirationDate: TimePeriod
    let activeTab: Tab

    $: transactionDetails = get(newTransactionDetails)
    $: isInternal = recipient.type === 'account'
    $: expirationTimePicker?.setNull(giftStorageDeposit)
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
        giftedStorageDeposit: giftStorageDeposit ? storageDeposit : 0,
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

            updatePopupProps({ isCallbackFromUnlockStronghold: true, calculatedStorageDeposit: storageDeposit })
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
            {#if initialExpirationDate !== undefined}
                <KeyValueBox keyText={localize('general.expirationTime')}>
                    <ExpirationTimePicker
                        slot="value"
                        bind:this={expirationTimePicker}
                        value={expirationDate}
                        initialSelected={initialExpirationDate}
                        disabled={true}
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

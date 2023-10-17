<script lang="ts">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { Error } from '@ui'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { Output, CommonOutput } from '@iota/sdk/out/types'
    import {
        getDefaultTransactionOptions,
        getOutputParameters,
        getStorageDepositFromOutput,
        NewTokenTransactionDetails,
        newTransactionDetails,
        NewTransactionType,
        TokenStandard,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import {
        AssetAmountInput,
        Button,
        ExpirationTimePicker,
        KeyValueBox,
        NetworkInput,
        OptionalInput,
        RecipientInput,
        Spinner,
        Text,
        Toggle,
    } from 'shared/components'
    import { ToggleColor } from '@ui/inputs/Toggle.svelte'
    import features from '@features/features'
    import { activeProfile } from '@core/profile'
    import { TimePeriod, debounce } from '@core/utils'
    import { handleError } from '@core/error/handlers'

    export let preparedOutput: Output

    // Inputs
    let assetAmountInput: AssetAmountInput
    let networkInput: NetworkInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput
    let expirationTimePicker: ExpirationTimePicker

    const isLayer2 = false

    const transactionDetails = get(newTransactionDetails)
    $: ({
        rawAmount,
        asset,
        unit,
        recipient,
        tag,
        metadata,
        expirationDate,
        surplus,
        giftStorageDeposit,
        layer2Parameters,
        disableToggleGift,
        disableChangeExpiration,
        disableAssetSelection,
    } = transactionDetails as NewTokenTransactionDetails)

    $: rawAmount, asset, recipient, unit, tag, metadata, expirationDate, giftStorageDeposit, void updateDetailsAndPrepareOutput()

    console.log('REINITTT!!!!!!!!!!')
    let tagInternal = tag
    let metadataInternal = metadata
    $: debounce(() => { tag = tagInternal }, 750)()
    $: debounce(() => { metadata = metadataInternal }, 750)()

    let iscpChainAddress = layer2Parameters?.networkAddress
    let storageDeposit = 0
    const initialExpirationDate: TimePeriod = getInitialExpirationDate()
    let minimumStorageDeposit = 0
    let visibleSurplus: number | undefined = undefined

    $: isBaseTokenTransfer =
    transactionDetails.type === NewTransactionType.TokenTransfer &&
    transactionDetails.asset?.metadata?.standard === TokenStandard.BaseToken
    $: showLayer2 = features?.network?.layer2?.enabled && ($activeProfile.isDeveloperProfile || isBaseTokenTransfer)
    $: hideGiftToggle = !!layer2Parameters || (disableToggleGift && !giftStorageDeposit)
    $: isTransferring = $selectedAccount.isTransferring

    let isPreparingOutput = false

    $: console.log('tx details:', transactionDetails)
    $: console.log('preparedOutput:', preparedOutput)
    $: console.log('exp date:', expirationDate)
    $: console.log('tag', tag)
    $: console.log('tagInternal', tagInternal)

    async function updateDetailsAndPrepareOutput(): Promise<void> {
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            rawAmount,
            asset,
            recipient,
            unit,
            expirationDate,
            giftStorageDeposit,
            tag,
            metadata,
            layer2Parameters,
            disableAssetSelection,
        })

        // TODO Need a better way to check recipient is ready
        if (rawAmount && (recipient?.address || recipient?.account)) {
            await updatePreparedOutputAndStorageDeposit()
        }
    }

    async function updatePreparedOutputAndStorageDeposit(): Promise<void> {
        const details = get(newTransactionDetails)
        try {
            isPreparingOutput = true

            const outputParams = await getOutputParameters(details)
            preparedOutput = await prepareOutput($selectedAccount.index, outputParams, getDefaultTransactionOptions())
            await updateStorageDeposit()

            return Promise.resolve()
        } catch (err) {
            handleError(err)
            return Promise.reject()
        } finally {
            isPreparingOutput = false
        }
    }

    async function updateStorageDeposit(): Promise<void> {
        const {
            storageDeposit: _storageDeposit,
            giftedStorageDeposit: _giftedStorageDeposit
        } = await getStorageDepositFromOutput($selectedAccount, preparedOutput as CommonOutput)

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

    function getInitialExpirationDate(): TimePeriod {
        if (expirationDate) {
            return TimePeriod.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
            return TimePeriod.OneDay
        } else {
            return TimePeriod.None
        }
    }

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

    function onContinueClick():void {
        openPopup({
            id: PopupId.SendConfirmation,
            overflow: true,
            props: {
                preparedOutput,
                storageDeposit,
                visibleSurplus
            }
        })
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<send-form-inputs class="flex flex-col space-y-4">
    <AssetAmountInput
        bind:this={assetAmountInput}
        bind:asset
        bind:rawAmount
        bind:unit
        {disableAssetSelection}
    />
    <NetworkInput bind:this={networkInput} bind:iscpChainAddress {showLayer2} />
    <RecipientInput bind:this={recipientInput} bind:recipient {isLayer2} />
    <optional-inputs class="flex flex-row flex-wrap gap-4">
        <OptionalInput
            bind:this={tagInput}
            bind:value={tagInternal}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
        />
        {#if !isLayer2}
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadataInternal}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
        {/if}
    </optional-inputs>
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
    <KeyValueBox
        keyText={localize('general.storageDeposit')}
        valueText={storageDeposit.toString()}
        tooltipText={localize('tooltips.transactionDetails.outgoing.storageDeposit')}
    />
    {#if isPreparingOutput}
        <Spinner message={'Output is being prepared'} />
    {:else}
        <Text fontSize={'base'}>Output is ready!</Text>
    {/if}
    {#if isTransferring}
        <Error error={localize('notifications.transferring')} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            classes="w-full"
            onClick={onContinueClick}
            disabled={isTransferring || isPreparingOutput}
            isBusy={isTransferring}
        >
            {localize('actions.next')}
        </Button>
    </popup-buttons>
</send-form-inputs>

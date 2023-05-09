<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IAsset,
        NewTransactionType,
        getAssetById,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { AssetAmountInput, Button, FontWeight, Text, TextType } from 'shared/components'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'

    const transactionDetails = get(newTransactionDetails)
    let assetAmountInput: AssetAmountInput
    let asset: IAsset
    let rawAmount: string
    let amount: string
    let unit: string
    let disableAssetSelection: boolean

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        asset = getAssetById(transactionDetails.assetId)
        rawAmount = transactionDetails.rawAmount
        unit = transactionDetails.unit
        disableAssetSelection = transactionDetails.disableAssetSelection
    }

    function onContinueClick(): void {
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            rawAmount,
            unit,
            disableAssetSelection,
        })
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        $sendFlowRouter.previous()
    }
</script>

<input-token-amount-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <input-token-amount-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">Input Token Amount Title</Text>
    </input-token-amount-title>
    <input-token-amount-content>
        <AssetAmountInput
            bind:this={assetAmountInput}
            bind:asset
            bind:rawAmount
            bind:amount
            bind:unit
            {disableAssetSelection}
        />
    </input-token-amount-content>
    <input-token-amount-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick} disabled={!amount}>
            {localize('actions.continue')}
        </Button>
    </input-token-amount-buttons>
</input-token-amount-view>

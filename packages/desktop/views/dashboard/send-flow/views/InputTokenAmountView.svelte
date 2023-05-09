<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IAsset,
        NewTransactionType,
        formatTokenAmountDefault,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { TokenAmountInput, TokenAmountTile, Button, FontWeight, Text, TextType } from '@ui'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'

    const transactionDetails = get(newTransactionDetails)
    let assetAmountInput: TokenAmountInput
    let asset: IAsset
    let rawAmount: string
    let amount: string
    let unit: string
    let recipient: string

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        asset = transactionDetails.asset
        rawAmount = transactionDetails.rawAmount
        unit = transactionDetails.unit
        recipient =
            transactionDetails.recipient.type === 'account'
                ? transactionDetails.recipient.account.name
                : transactionDetails.recipient.address
    }

    $: availableBalance = asset?.balance?.available

    function setToMax(): void {
        if (asset?.metadata?.decimals) {
            amount = formatTokenAmountDefault(availableBalance, asset?.metadata, unit, false)
        } else {
            amount = availableBalance.toString() ?? '0'
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await assetAmountInput?.validate()
            return true
        } catch (err) {
            console.error('Error: ', err)
            return false
        }
    }

    async function onContinueClick(): Promise<void> {
        const isValid = await validate()
        if (isValid) {
            updateNewTransactionDetails({
                type: NewTransactionType.TokenTransfer,
                rawAmount,
            })
            $sendFlowRouter.next()
        }
    }

    function onBackClick(): void {
        $sendFlowRouter.previous()
    }
</script>

<input-token-amount-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <input-token-amount-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
            >{localize('popups.transaction.selectAmount', {
                values: { tokenName: asset.metadata.name, recipient },
            })}</Text
        >
    </input-token-amount-title>
    <input-token-amount-content class="w-full flex flex-col items-center gap-6">
        <TokenAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:amount {unit} />
        <TokenAmountTile {asset} onMaxClick={setToMax} />
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

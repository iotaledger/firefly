<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IAsset,
        NewTransactionType,
        formatTokenAmountDefault,
        getUnitFromTokenMetadata,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { TokenAmountInput, TokenAmountTile } from '@ui'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    const transactionDetails = get(newTransactionDetails)
    let assetAmountInput: TokenAmountInput
    let asset: IAsset
    let rawAmount: string
    let amount: string
    let unit: string

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        asset = transactionDetails.asset
        rawAmount = transactionDetails.rawAmount
        unit = transactionDetails.unit || getUnitFromTokenMetadata(asset?.metadata)
    }

    $: availableBalance = asset?.balance?.available

    function setToMax(): void {
        if (asset?.metadata?.decimals) {
            amount = formatTokenAmountDefault(availableBalance, asset?.metadata, unit, false)
        } else {
            amount = availableBalance.toString() ?? '0'
        }
    }

    async function onContinueClick(): Promise<void> {
        try {
            await assetAmountInput?.validate()
            updateNewTransactionDetails({
                type: NewTransactionType.TokenTransfer,
                rawAmount,
            })
            $sendFlowRouter.next()
        } catch (err) {
            console.error(err)
        }
    }

    function onBackClick(): void {
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            rawAmount: undefined,
        })
        $sendFlowRouter.previous()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectAmount', {
        values: { tokenName: asset.metadata.name },
    })}
    leftButton={{ text: localize('actions.back'), onClick: onBackClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !amount }}
>
    <TokenAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:inputtedAmount={amount} {unit} />
    <TokenAmountTile {asset} onMaxClick={setToMax} />
</SendFlowTemplate>

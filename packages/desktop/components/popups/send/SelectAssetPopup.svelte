<script lang="ts">
    import { onMount } from 'svelte'
    import { AssetList, Button, FontWeight, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import { getAccountAssetsForSelectedAccount, IAccountAssets, resetNewTokenTransactionDetails } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup'
    import { sendRouter } from '@desktop/routers'

    let assets: IAccountAssets
    $: assets = getAccountAssetsForSelectedAccount($marketCoinPrices)

    function onCancelClick(): void {
        $sendRouter.reset()
        closePopup()
    }

    function onContinueClick(): void {
        $sendRouter.next()
    }

    onMount(() => {
        resetNewTokenTransactionDetails()
    })
</script>

<select-asset-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.transaction.title')}
    </Text>
    <select-asset-inputs class="flex flex-col space-y-4">
        <AssetList {assets} hideHeader />
    </select-asset-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</select-asset-popup>

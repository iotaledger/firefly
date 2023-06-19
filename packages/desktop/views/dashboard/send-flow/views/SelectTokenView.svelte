<script lang="ts">
    import { AssetTile, IconInput } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import {
        getAccountAssetsForSelectedAccount,
        AccountAssets,
        IAsset,
        newTransactionDetails,
        NewTransactionType,
        updateNewTransactionDetails,
        TokenStandard,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { get } from 'svelte/store'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    const transactionDetails = get(newTransactionDetails)

    let selectedAsset: IAsset =
        transactionDetails?.type === NewTransactionType.TokenTransfer ? transactionDetails.asset : undefined
    let assetList: IAsset[]
    let searchValue: string = ''

    let assets: AccountAssets
    $: assets = getAccountAssetsForSelectedAccount($marketCoinPrices)
    $: assets, searchValue, setFilteredAssetList()

    function getAssetList(): IAsset[] {
        const list = []
        for (const assetsPerNetwork of Object.values(assets)) {
            if (assetsPerNetwork?.baseCoin) {
                list.push(assetsPerNetwork.baseCoin)
            }
            list.push(...(assetsPerNetwork?.nativeTokens ?? []))
        }
        return list
    }

    function setFilteredAssetList(): void {
        const list = getAssetList()

        assetList = list.filter(isVisibleAsset)
        if (!assetList.some((asset) => asset.id === selectedAsset?.id)) {
            selectedAsset = undefined
        }
    }

    function isVisibleAsset(asset: IAsset): boolean {
        const _searchValue = searchValue.toLowerCase()
        const name = asset?.metadata?.name
        const ticker =
            asset?.metadata?.standard === TokenStandard.BaseToken ? asset?.metadata.unit : asset?.metadata.symbol

        return (
            (name && name.toLowerCase().includes(_searchValue)) ||
            (ticker && ticker.toLowerCase().includes(_searchValue))
        )
    }

    function onCancelClick(): void {
        $sendFlowRouter.reset()
        closePopup()
    }

    function onContinueClick(): void {
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            asset: selectedAsset,
        })

        $sendFlowRouter.next()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectToken')}
    leftButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !selectedAsset }}
>
    <IconInput bind:value={searchValue} icon={IconEnum.Search} placeholder={localize('general.search')} />
    <div class="-mr-3">
        <div class="asset-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each assetList as asset}
                <AssetTile
                    {asset}
                    onClick={() => (selectedAsset = asset)}
                    selected={selectedAsset?.id === asset.id && selectedAsset?.chainId === asset?.chainId}
                />
            {/each}
        </div>
    </div>
</SendFlowTemplate>

<style lang="scss">
    .asset-list {
        max-height: 400px;
        overflow-y: scroll;
    }
</style>

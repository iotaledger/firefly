<script lang="ts">
    import { AssetTile, FontWeight, Icon, TextInput } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import {
        getAccountAssetsForSelectedAccount,
        IAccountAssets,
        IAsset,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
        TokenStandard,
    } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup'
    import { get } from 'svelte/store'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    const transactionDetails = get(newTransactionDetails)

    let selectedAssetId: string =
        transactionDetails?.type === NewTransactionType.TokenTransfer ? transactionDetails.assetId : undefined
    let assetList: IAsset[]
    let searchValue: string = ''

    let assets: IAccountAssets
    $: assets = getAccountAssetsForSelectedAccount($marketCoinPrices)
    $: assets, searchValue, setFilteredAssetList()

    function setFilteredAssetList(): void {
        if (!assets) {
            assetList = []
        } else {
            assetList = [assets.baseCoin, ...assets.nativeTokens].filter(isVisibleAsset)
        }
        if (!assetList.some((asset) => asset.id === selectedAssetId)) {
            selectedAssetId = undefined
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
        setNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            assetId: selectedAssetId,
            rawAmount: undefined,
            unit: undefined,
            disableAssetSelection: undefined,
        })

        $sendFlowRouter.next()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectToken')}
    leftButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !selectedAssetId }}
>
    <TextInput
        bind:value={searchValue}
        placeholder={localize('general.search')}
        fontWeight={FontWeight.medium}
        color="gray-500"
    >
        <Icon slot="left" icon={IconEnum.Search} classes="text-gray-500 dark:text-white mr-2" />
    </TextInput>
    <div class="-mr-3">
        <div class="asset-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each assetList as asset}
                <AssetTile
                    {asset}
                    onClick={() => (selectedAssetId = asset.id)}
                    classes="border-2 border-solid {selectedAssetId === asset.id
                        ? 'border-blue-500 dark:border-gray-500'
                        : 'border-transparent'}"
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

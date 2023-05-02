<script lang="ts">
    import { AssetTile, Button, FontWeight, Icon, Text, TextInput, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import {
        getAccountAssetsForSelectedAccount,
        IAccountAssets,
        IAsset,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
    } from '@core/wallet'
    import { sendFlowRouter } from '../send-flow-router'
    import { closePopup } from '@auxiliary/popup'
    import { get } from 'svelte/store'
    import { Icon as IconEnum } from '@auxiliary/icon'

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
            assetList = [assets.baseCoin, ...assets.nativeTokens].filter(
                (asset) =>
                    asset?.metadata?.name && asset.metadata.name.toLowerCase().includes(searchValue.toLowerCase())
            )
        }
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

<select-asset-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.transaction.selectToken')}
    </Text>
    <select-token-buttons class="w-full space-y-4">
        <TextInput
            bind:value={searchValue}
            placeholder={localize('general.search')}
            fontSize="15"
            clearPadding
            containerClasses="py-2 px-3"
            fontWeight={FontWeight.medium}
            color="gray-500"
        >
            <Icon slot="left" icon={IconEnum.Search} classes="text-gray-500 dark:text-white mr-2" />
        </TextInput>
        <div class="overflow-hidden -mr-3.5">
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
    </select-token-buttons>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick} disabled={!selectedAssetId}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</select-asset-popup>

<style lang="scss">
    select-token-buttons {
        max-height: 450px;
        overflow: hidden;

        .asset-list {
            overflow-y: scroll;
        }
    }
</style>

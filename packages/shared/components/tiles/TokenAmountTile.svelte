<script lang="ts">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, Tile, Text, FontWeight, TextType } from '@ui'
    import { truncateString } from '@core/utils'
    import { localize } from '@core/i18n'

    export let asset: IAsset
    export let onMaxClick: () => unknown

    $: availableBalance = asset?.balance?.available ?? 0
</script>

{#if asset && asset.metadata && asset.balance}
    <Tile>
        <div class="w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <AssetIcon {asset} />
                <div class="flex flex-col">
                    <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                        {asset.metadata.name
                            ? truncateString(asset.metadata.name, 13, 0)
                            : truncateString(asset.id, 6, 7)}
                    </Text>
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text type={TextType.p} secondary smaller>
                            {formatTokenAmountBestMatch(availableBalance, asset.metadata)}
                        </Text>
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-right">
                <button
                    on:click={onMaxClick}
                    class="py-2 px-3 rounded-md text-13 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                >
                    {localize('actions.useMax')}
                </button>
            </div>
        </div>
    </Tile>
{/if}

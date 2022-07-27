<script lang="typescript">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, ClickableTile, StakingAssetTile, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { truncateString } from 'shared/lib/helpers'

    export let asset: IAsset
    export let onClick: () => unknown

    const isStakingAsset = asset?.metadata?.name === 'Assembly'
</script>

{#if isStakingAsset}
    <StakingAssetTile {asset} />
{:else}
    <ClickableTile {onClick} {...$$restProps}>
        <div class="asset w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <AssetIcon {asset} />
                <div class="flex flex-col">
                    <Text type={TextType.p} fontWeight={FontWeightText.semibold}>
                        {asset?.metadata?.name
                            ? truncateString(asset?.metadata?.name, 6, 6, 2)
                            : truncateString(asset?.id, 6, 7)}
                    </Text>
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text type={TextType.p} secondary smaller>{asset?.fiatPrice ?? '-'}</Text>
                        <slot name="subLabel" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-right">
                <Text type={TextType.p} fontWeight={FontWeightText.semibold}>
                    {formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata)}
                </Text>
                <div class="flex flex-row justify-between items-center text-right">
                    <Text type={TextType.p} secondary smaller classes="flex-grow">
                        {asset?.fiatBalance ? `≈ ${asset?.fiatBalance}` : '-'}
                    </Text>
                </div>
            </div>
        </div>
    </ClickableTile>
{/if}

<style type="text/scss">
    .asset {
        font-feature-settings: 'calt' off; // disables 'x' formatting while surrounded by numbers
    }
</style>

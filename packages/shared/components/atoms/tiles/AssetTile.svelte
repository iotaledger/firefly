<script lang="typescript">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { isBright } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { ClickableTile, Icon, StakingAssetTile, Text } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let asset: IAsset

    const isStakingAsset = asset?.metadata?.name === 'Assembly'

    $: assetIconColor = isBright(asset?.metadata?.primaryColor) ? 'gray-800' : 'white'

    function handleTileClick(): void {
        openPopup({
            type: 'sendForm',
            overflow: true,
            props: {
                asset,
            },
        })
    }
</script>

{#if isStakingAsset}
    <StakingAssetTile {asset} />
{:else}
    <ClickableTile onClick={handleTileClick} {...$$restProps}>
        <div class="flex flex-row items-center text-left space-x-4">
            <div
                class="icon-bg bg-{asset?.metadata?.primaryColor ??
                    'transparent'} w-8 h-8 p-1 rounded-full flex justify-center items-center"
                style="--icon-bg-color: {asset?.metadata?.primaryColor}"
            >
                <Icon
                    icon={asset?.metadata?.name?.toLocaleLowerCase()}
                    width="100%"
                    height="100%"
                    classes="text-{assetIconColor ?? 'blue-500'} text-center"
                />
            </div>
            <div class="flex flex-col">
                <Text type="p" fontWeight={FontWeightText.semibold}>{asset?.metadata?.name}</Text>
                <div class="flex flex-row justify-between items-center text-left">
                    <Text type="p" secondary smaller>{asset?.fiatPrice ?? '-'}</Text>
                    <slot name="subLabel" />
                </div>
            </div>
        </div>
        <div class="flex flex-col text-right">
            <Text type="p" fontWeight={FontWeightText.semibold}>
                {formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata)}
            </Text>
            <div class="flex flex-row justify-between items-center text-right">
                <slot name="subText" />
                <Text type="p" secondary smaller classes="flex-grow">
                    {asset?.fiatBalance ? `≈ ${asset?.fiatBalance}` : '-'}
                </Text>
            </div>
        </div>
    </ClickableTile>
{/if}

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>

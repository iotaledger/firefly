<script lang="typescript">
    import { NetworkProtocol } from '@core/network'
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { isBright } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { ClickableTile, Icon, StakingAssetTile, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { truncateString } from 'shared/lib/helpers'

    export let asset: IAsset

    let icon: string

    const isStakingAsset = asset?.metadata?.name === 'Assembly'

    $: assetIconColor = isBright(asset?.metadata?.primaryColor) ? 'gray-800' : 'white'
    $: switch (asset?.metadata?.name?.toLocaleLowerCase()) {
        case NetworkProtocol.IOTA:
        case NetworkProtocol.Shimmer:
            icon = asset?.metadata?.name?.toLocaleLowerCase()
            break
        default:
            icon = 'tokens'
    }

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
        <div class="asset w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <div
                    class="
                        {asset?.metadata?.primaryColor ? 'icon-bg' : 'bg-blue-500'}
                        w-8 h-8 p-1 rounded-full flex justify-center items-center
                    "
                    style={asset?.metadata?.primaryColor ? `--icon-bg-color: ${asset?.metadata?.primaryColor}` : ''}
                >
                    <Icon {icon} width="80%" height="80%" classes="text-{assetIconColor ?? 'blue-500'} text-center" />
                </div>
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
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>

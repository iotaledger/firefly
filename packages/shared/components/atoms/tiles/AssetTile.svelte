<script lang="typescript">
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, ClickableTile, Text, FontWeight, TextType } from 'shared/components'
    import { truncateString } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { formatCurrency } from '@core/i18n/utils'

    export let asset: IAsset
    export let onClick: () => unknown
    export let squashed = false

    $: fiatPrice = asset?.marketPrices?.[$activeProfile?.settings?.marketCurrency]
    $: fiatBalance = (fiatPrice * asset?.balance?.total) / 10 ** asset?.metadata?.decimals
</script>

<ClickableTile {onClick} {...$$restProps}>
    <div class="w-full flex flex-row justify-between items-center">
        <div class="flex flex-row items-center text-left space-x-4">
            <AssetIcon small={squashed} {asset} />
            <div class="flex flex-col">
                <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                    {asset?.metadata?.name
                        ? truncateString(asset?.metadata?.name, 13, 0)
                        : truncateString(asset?.id, 6, 7)}
                </Text>
                {#if !squashed}
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text type={TextType.p} secondary smaller>{fiatPrice ? formatCurrency(fiatPrice) : ''}</Text>
                        <slot name="subLabel" />
                    </div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col text-right">
            <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                {formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata)}
            </Text>
            {#if !squashed}
                <div class="flex flex-row justify-between items-center text-right">
                    <Text type={TextType.p} secondary smaller classes="flex-grow">
                        {fiatBalance ? `≈ ${formatCurrency(fiatBalance)}` : ''}
                    </Text>
                </div>
            {/if}
        </div>
    </div>
</ClickableTile>

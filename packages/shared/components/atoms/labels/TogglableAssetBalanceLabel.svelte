<script lang="typescript">
    import { Text, FontWeight, TextType } from 'shared/components'
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'

    export let asset: IAsset

    let isToggled = false
    function toggle(): void {
        isToggled = !isToggled
    }
</script>

{#if asset}
    <button on:click={toggle}>
        <div class="flex flex-col flex-wrap items-start space-y-1">
            <Text type={TextType.h1} fontWeight={FontWeight.semibold}>
                {isToggled
                    ? formatCurrency(getMarketAmountFromAssetValue(asset?.balance?.total, asset))
                    : formatTokenAmountBestMatch(asset?.balance?.total, asset?.metadata)}
            </Text>
            <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-500">
                {localize('general.availableBalanceWithValue', {
                    values: {
                        balance: isToggled
                            ? formatCurrency(getMarketAmountFromAssetValue(asset?.balance?.available, asset))
                            : formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata),
                    },
                })}
            </Text>
        </div>
    </button>
{/if}

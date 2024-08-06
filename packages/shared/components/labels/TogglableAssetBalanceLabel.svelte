<script lang="ts">
    import { Text, FontWeight, TextType } from 'shared/components'
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { NetworkId } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let asset: IAsset

    $: availableMarketValue = getMarketAmountFromAssetValue(asset?.balance?.available, asset)
    $: totalMarketValue = getMarketAmountFromAssetValue(asset?.balance?.total, asset)
    $: disabled = Number.isNaN(totalMarketValue) || Number.isNaN(availableMarketValue)
    $: isCustomNetwork = $activeProfile?.network?.id === NetworkId.Custom

    let isToggled = false
    function toggle(): void {
        isToggled = !isToggled
    }
</script>

{#if asset}
    <button on:click={toggle} type="button" {disabled}>
        <div class="flex flex-col flex-wrap items-start space-y-1">
            <Text type={TextType.h1} fontWeight={FontWeight.semibold}>
                {isToggled && !isCustomNetwork
                    ? formatCurrency(totalMarketValue)
                    : formatTokenAmountBestMatch(asset?.balance?.total, asset?.metadata)}
            </Text>
            <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-500">
                {localize('general.availableBalanceWithValue', {
                    values: {
                        balance:
                            isToggled && !isCustomNetwork
                                ? formatCurrency(availableMarketValue)
                                : formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata),
                    },
                })}
            </Text>
        </div>
    </button>
{/if}

<style lang="scss">
    button {
        &:disabled {
            cursor: default;
        }
    }
</style>

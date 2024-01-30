<script lang="ts">
    import { Text, FontWeight, TextType } from 'shared/components'
    import { formatTokenAmountBestMatch, IAsset, selectedWallet } from '@core/wallet'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'

    export let asset: IAsset

    $: availableMarketValue = getMarketAmountFromAssetValue(asset?.balance?.available, asset)
    $: totalMarketValue = getMarketAmountFromAssetValue(asset?.balance?.total, asset)
    $: disabled = Number.isNaN(totalMarketValue) || Number.isNaN(availableMarketValue)
    $: mana = $selectedWallet?.balances?.mana

    let isToggled = false
    function toggle(): void {
        isToggled = !isToggled
    }
</script>

{#if asset}
    <button on:click={toggle} type="button" {disabled}>
        <div class="flex flex-col flex-wrap items-start space-y-1">
            <Text type={TextType.h1} fontWeight={FontWeight.semibold}>
                {isToggled
                    ? formatCurrency(totalMarketValue)
                    : formatTokenAmountBestMatch(asset?.balance?.total, asset?.metadata)}
            </Text>
            <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-500">
                {localize('general.availableBalanceWithValue', {
                    values: {
                        balance: isToggled
                            ? formatCurrency(availableMarketValue)
                            : formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata),
                    },
                })}
            </Text>
            {#if mana}
                <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-500">
                    {localize('general.availableManaWithValue', {
                        values: {
                            mana: Number(mana.available.stored),
                        },
                    })}
                </Text>
            {/if}
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

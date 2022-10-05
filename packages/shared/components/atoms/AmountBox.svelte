<script lang="typescript">
    import { IPersistedAsset } from '@core/wallet'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { AssetIcon, Text } from 'shared/components'

    export let asset: IPersistedAsset
    export let unit: string
    export let amount: string
    export let fiatAmount: string = ''
</script>

<amount class="flex flex-col items-center">
    <div class="flex flex-row space-x-3">
        <AssetIcon {asset} />
        <div class="flex flex-row flex-wrap justify-center items-baseline space-x-0.1">
            <Text type="h1" fontWeight={FontWeight.semibold}>{amount}</Text>
            {#if unit}
                <Text type="h4" classes="ml-1" fontWeight={FontWeight.medium}>{unit}</Text>
            {/if}
        </div>
    </div>
    {#if fiatAmount}
        <Text fontSize="md" color="gray-600" darkColor="gray-500">{fiatAmount}</Text>
    {/if}
</amount>

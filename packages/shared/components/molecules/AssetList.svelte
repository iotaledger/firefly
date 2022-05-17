<script lang="typescript">
    import { AssetTile, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { IAsset } from '@core/wallet'

    export let assets: IAsset[]
</script>

{#if assets && assets.length > 0}
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 p-6">
        <Text classes="text-left" type="h5">{localize('general.myAssets')}</Text>
        <div class="flex flex-auto flex-col overflow-y-auto h-1 -mr-2 pr-2 space-y-2.5 scroll-secondary scrollable-y">
            {#each assets as asset}
                <AssetTile {asset} />
            {/each}
        </div>
    </div>
{/if}

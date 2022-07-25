<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAccountAssets } from '@core/wallet/interfaces/account-assets.interface'
    import { AssetTile, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'

    export let assets: IAccountAssets
</script>

{#if assets}
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 p-6">
        <Text classes="text-left" type={TextType.h5}>{localize('general.assets')}</Text>
        <div class="flex flex-auto flex-col overflow-y-auto h-1 -mr-2 pr-2 space-y-2.5 scroll-secondary scrollable-y">
            <AssetTile asset={assets?.baseCoin} />
            {#each assets?.nativeTokens as asset}
                <AssetTile {asset} />
            {/each}
        </div>
    </div>
{/if}

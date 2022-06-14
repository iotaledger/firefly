<script lang="typescript">
    import { AssetTile, Text } from 'shared/components'
    import { assets } from 'shared/lib/assets'
    import { localize } from '@core/i18n'

    export let classes = ''
</script>

<div class="h-full w-full space-y-4 flex flex-auto flex-col px-4 pt-6 {classes}">
    <Text type="h5" classes="px-2">
        {localize('general.myAssets')}
    </Text>
    <div class="flex flex-auto flex-col overflow-y-auto h-1">
        {#each $assets as asset}
            <div class="w-full mb-2.5">
                <AssetTile {asset} />
            </div>
        {/each}
    </div>
</div>

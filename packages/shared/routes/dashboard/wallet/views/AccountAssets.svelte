<script lang="typescript">
    import { AssetTile, Text } from 'shared/components'
    import { assets } from 'shared/lib/assets'
    import { localize } from '@core/i18n'

    export let classes = ''
    export let scroll = true
    export let styles = ''
    export let scrollDetection = (node: Element): void => {}
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 p-6 {classes}" style={styles}>
    <Text classes="text-left" type="h5">{localize('general.myAssets')}</Text>
    <div class="flex flex-auto flex-col h-0 -mr-2 pr-2 {scroll ? 'overflow-y-auto' : ''}" use:scrollDetection>
        {#each $assets as asset}
            <div class="w-full mb-2.5">
                <AssetTile {asset} />
            </div>
        {/each}
    </div>
</div>

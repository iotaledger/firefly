<script lang="ts">
    import { INft } from '@core/nfts'
    import { MediaPlaceholder, NftMedia } from 'shared/components'

    export let nft: INft
    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let useCaching: boolean = true

    $: nftType = nft?.parsedMetadata?.type
    $: parentType = nftType?.split('/')?.[0]
</script>

<div
    class="
        flex overflow-hidden flex-shrink-0 rounded-md items-center justify-center
        {nft?.downloadMetadata?.isLoaded ? '' : 'bg-gray-500'}
        {size === 'small' && 'w-6 h-6'}
        {size === 'medium' && 'w-8 h-8'}
        {size === 'large' && 'w-10 h-10'}
    "
>
    {#if parentType === 'image'}
        <NftMedia {nft} classes="min-w-full min-h-full object-cover" {useCaching}>
            <div
                slot="placeholder"
                class="
                    w-full h-full
                    {size === 'small' && 'p-1'}
                    {size === 'medium' && 'p-2'}
                    {size === 'large' && 'p-2'}
                "
            >
                <MediaPlaceholder type={nftType} iconOnly />
            </div>
        </NftMedia>
    {:else}
        <div
            class="
                w-full h-full
                {size === 'small' && 'p-1'}
                {size === 'medium' && 'p-2'}
                {size === 'large' && 'p-2'}
            "
        >
            <MediaPlaceholder type={nftType} iconOnly />
        </div>
    {/if}
</div>

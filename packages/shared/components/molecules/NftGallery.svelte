<script lang="typescript">
    import { INft } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'

    export let nfts: INft[] = []
</script>

<div
    class="grid overflow-scroll sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-3 2xl:gap-4 pr-3 -mr-5 "
>
    {#each nfts as nft}
        <NftGalleryItem {nft} />
    {/each}
</div>

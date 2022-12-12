<script lang="typescript">
    import { queriedNfts } from '@core/nfts'
    import NftGalleryItem from './NftGalleryItem.svelte'
</script>

<div
    class="grid overflow-hidden sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-3 2xl:gap-4"
>
    {#each $queriedNfts as nft}
        <NftGalleryItem {nft} />
    {/each}
</div>

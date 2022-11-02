<script lang="typescript">
    import { Text, TextType, NftGalleryItem } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { INft, selectedAccountNfts } from '@core/nfts'

    function handleNftClick(nft: INft): void {
    function onClick(): void {
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<Text type={TextType.h3}>Collectibles</Text>
<div class="h-full flex flex-wrap flex-row gap-6 mt-7 pb-7 scrollable-y">
    {#each $selectedAccountNfts as nft}
        <NftGalleryItem {nft} onClick={() => handleNftClick(nft)} />
    {/each}
</div>

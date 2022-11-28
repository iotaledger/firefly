<script lang="typescript">
    import { Text, TextType, NftGalleryItem } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { INft, selectedAccountNfts } from '@core/nfts'
    import { selectedNftId } from '../stores/selected-nft.store'
    import { localize } from '@core/i18n'

    function handleNftClick(nft: INft): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<div class="flex flex-row text-left space-x-1">
    <Text type={TextType.h3}>{localize('views.collectibles.gallery.title')}</Text>
    <Text type={TextType.h3} color="gray-500">• {$selectedAccountNfts.length}</Text>
</div>

<div class="h-full flex flex-wrap flex-row gap-6 mt-7 pb-7 scrollable-y">
    {#each $selectedAccountNfts as nft}
        <NftGalleryItem {nft} onClick={() => handleNftClick(nft)} />
    {/each}
</div>

<script lang="typescript">
    import { Text, FontWeight, NftGalleryItem, ReceiveButton, Illustration } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { INft, selectedAccountNfts } from '@core/nfts'
    import { selectedNftId } from '../stores/selected-nft.store'
    import { localize } from '@core/i18n'

    function handleNftClick(nft: INft): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<div class="flex flex-col w-full h-full space-y-4">
    <div class="flex flex-row text-left space-x-1 items-center grow-0">
        <Text fontSize="text-14" fontWeight={FontWeight.semibold}>{localize('views.collectibles.gallery.title')}</Text>
        <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500">• {$selectedAccountNfts.length}</Text
        >
    </div>

    <div class="w-full h-full flex items-center justify-center grow-1">
        {#if $selectedAccountNfts.length}
            <div class="h-full flex flex-wrap flex-row gap-6 scrollable-y">
                {#each $selectedAccountNfts as nft}
                    <NftGalleryItem {nft} onClick={() => handleNftClick(nft)} />
                {/each}
            </div>
        {:else}
            <div class="flex flex-col items-center space-y-8">
                <Illustration illustration="empty-collectibles" width="134" height="134" />
                <div class="flex flex-col items-center">
                    <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500"
                        >{localize('views.collectibles.gallery.emptyTitle')}</Text
                    >
                    <Text fontSize="text-14" color="gray-500"
                        >{localize('views.collectibles.gallery.emptyDescription')}</Text
                    >
                </div>
                <ReceiveButton text={localize('actions.depositNft')} />
            </div>
        {/if}
    </div>
</div>

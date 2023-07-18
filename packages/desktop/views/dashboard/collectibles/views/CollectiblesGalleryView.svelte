<script lang="ts">
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { nftSearchTerm, queriedNfts, ownedNfts } from '@core/nfts'
    import { FontWeight, Illustration, Text, SearchInput, NftGalleryItem, Button, ButtonSize } from 'shared/components'

    function handleReceiveFundsPopup(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
            props: {
                title: localize('actions.depositNft'),
            },
        })
    }
</script>

<div class="flex flex-col w-full h-full space-y-4">
    {#if $ownedNfts.length}
        <div class="flex flex-row justify-between">
            <div class="flex flex-row text-left space-x-1 items-center">
                <Text fontSize="text-14" fontWeight={FontWeight.semibold}
                    >{localize('views.collectibles.gallery.title')}</Text
                >
                <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500">• {$queriedNfts.length}</Text
                >
            </div>
            <div class="flex items-center" style="height: 40px">
                <SearchInput bind:value={$nftSearchTerm} />
            </div>
        </div>

        {#if $queriedNfts.length}
            <div
                class="grid overflow-scroll sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-3 2xl:gap-4 pb-1 pr-3 -mr-5"
            >
                {#each $queriedNfts as nft}
                    <NftGalleryItem {nft} />
                {/each}
            </div>
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center space-y-8">
                <Illustration illustration={IllustrationEnum.EmptyCollectibles} width="134" height="134" />
                <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500"
                    >{localize('views.collectibles.gallery.noResults')}</Text
                >
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex items-center justify-center grow-1">
            <div class="flex flex-col items-center space-y-8">
                <Illustration illustration={IllustrationEnum.EmptyCollectibles} width="134" height="134" />
                <div class="flex flex-col items-center">
                    <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500"
                        >{localize('views.collectibles.gallery.emptyTitle')}</Text
                    >
                    <Text fontSize="text-14" color="gray-500"
                        >{localize('views.collectibles.gallery.emptyDescription')}</Text
                    >
                </div>
                <Button size={ButtonSize.Large} onClick={handleReceiveFundsPopup}>
                    {localize('actions.depositNft')}
                </Button>
            </div>
        </div>
    {/if}
</div>

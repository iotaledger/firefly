<script lang="ts">
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { localize } from '@core/i18n'
    import { nftSearchTerm, queriedNfts, ownedNfts } from '@core/nfts'
    import { FontWeight, Illustration, NftGallery, Text, ReceiveButton, SearchInput } from 'shared/components'
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
            <NftGallery nfts={$queriedNfts} />
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
                <ReceiveButton text={localize('actions.depositNft')} title={localize('actions.depositNft')} />
            </div>
        </div>
    {/if}
</div>

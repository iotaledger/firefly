<script lang="ts">
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { nftSearchTerm, queriedNfts, ownedNfts } from '@core/nfts'
    import { FontWeight, Illustration, Text, SearchInput, NftGalleryItem, Button, ButtonSize } from 'shared/components'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { onMount } from 'svelte'

    let windowHeight = document.body.clientWidth

    onMount(() => {
        function resizeListener() {
            if (windowHeight !== document.body.clientWidth) {
                windowHeight = document.body.clientWidth
            }
        }

        addEventListener('resize', resizeListener)

        return () => removeEventListener('resize', resizeListener)
    })

    function onDepositNftClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
            props: {
                title: localize('actions.depositNft'),
            },
        })
    }

    $: nftsRows = (() => {
        let cols = 5
        if (windowHeight < 900) {
            cols = 1
        } else if (windowHeight < 1600) {
            cols = 2
        } else if (windowHeight < 2000) {
            cols = 3
        } else if (windowHeight < 1800) {
            cols = 4
        }

        const rowsLengh = Math.ceil($queriedNfts.length / cols)
        const nftsRows = Array.from({ length: rowsLengh }, (e, i) => {
            const start = i * cols
            const end = start + cols
            return $queriedNfts.slice(start, end)
        })
        return nftsRows
    })()
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
        {#if nftsRows.length}
            <VirtualList items={nftsRows} let:item>
                <div class="flex mb-3 gap-3 justify-center h-full">
                    {#each item as nft}
                        {#if nft !== undefined}
                            <NftGalleryItem {nft} />
                        {/if}
                    {/each}
                </div>
            </VirtualList>
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
                <Button size={ButtonSize.Large} onClick={onDepositNftClick}>
                    {localize('actions.depositNft')}
                </Button>
            </div>
        </div>
    {/if}
</div>

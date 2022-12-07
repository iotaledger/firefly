<script lang="typescript">
    import {
        Text,
        TextInput,
        NftGalleryItem,
        TogglableButton,
        Icon,
        FontWeight,
        ReceiveButton,
        Illustration,
    } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { INft, nftSearchTerm, selectedAccountNfts, queriedNfts } from '@core/nfts'
    import { selectedNftId } from '../stores/selected-nft.store'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'

    let searchActive = false
    let inputElement: HTMLInputElement

    $: if (searchActive && inputElement) inputElement.focus()
    $: searchValue = searchActive ? searchValue.toLowerCase() : ''
    $: if ($selectedAccountNfts) {
        debounce(() => {
            $nftSearchTerm = searchValue
        })()
    }
    function handleNftClick(nft: INft): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<div class="flex flex-col w-full h-full space-y-4">
    {#if $selectedAccountNfts.length}
        <div class="flex flex-row justify-between">
            <div class="flex flex-row text-left space-x-1 items-center">
                <Text fontSize="text-14" fontWeight={FontWeight.semibold}
                    >{localize('views.collectibles.gallery.title')}</Text
                >
                <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500">• {$queriedNfts.length}</Text
                >
            </div>

            <div class="flex items-center" style="height: 40px">
                {#if searchActive}
                    <TextInput
                        bind:inputElement
                        bind:value={searchValue}
                        hasFocus={true}
                        placeholder={localize('general.search')}
                        fontSize="15"
                        clearPadding
                        containerClasses="py-2 px-3"
                        fontWeight={FontWeight.medium}
                        color="gray-500"
                    >
                        <Icon slot="left" icon="search" classes="mr-2 text-gray-500 dark:text-white" />
                        <button on:click={() => (searchActive = false)} slot="right">
                            <Icon
                                icon="close"
                                classes="cursor-pointer ml-2 text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-200"
                            />
                        </button>
                    </TextInput>
                {:else}
                    <TogglableButton icon="search" bind:active={searchActive} />
                {/if}
            </div>
        </div>

        <div class="w-full h-full ">
            {#if $queriedNfts.length}
                <div class="h-full gallery-grid scrollable-y">
                    {#each $queriedNfts as nft}
                        <NftGalleryItem {nft} onClick={() => handleNftClick(nft)} />
                    {/each}
                </div>
            {:else}
                <div class="w-full h-full flex flex-col items-center justify-center space-y-8">
                    <Illustration illustration="empty-collectibles" width="134" height="134" />
                    <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500"
                        >{localize('views.collectibles.gallery.noResults')}</Text
                    >
                </div>
            {/if}
        </div>
    {:else}
        <div class="w-full h-full flex items-center justify-center grow-1">
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
        </div>
    {/if}
</div>

<style lang="scss">
    .gallery-grid {
        --grid-layout-gap: 1rem;
        --grid-column-count: 6;
        --grid-item--min-width: 240px;

        /**
        * Calculated values.
        */
        --gap-count: calc(var(--grid-column-count) - 1);
        --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
        --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));

        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr)
        );
        grid-gap: var(--grid-layout-gap);
    }
</style>

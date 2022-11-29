<script lang="typescript">
    import { Text, TextInput, NftGalleryItem, TogglableButton, Icon, FontWeight } from 'shared/components'
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

<div class="flex flex-row justify-between">
    <div class="flex flex-row text-left space-x-1 items-center">
        <Text fontSize="text-14" fontWeight={FontWeight.semibold}>{localize('views.collectibles.gallery.title')}</Text>
        <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500">• {$queriedNfts.length}</Text>
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

<div class="h-full flex flex-wrap flex-row gap-6 mt-4 scrollable-y">
    {#each $queriedNfts as nft}
        <NftGalleryItem {nft} onClick={() => handleNftClick(nft)} />
    {/each}
</div>

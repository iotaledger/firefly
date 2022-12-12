<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMedia } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { selectedNftId } from '@core/nfts/stores'

    export let nft: INft

    function openCollectiblesDetailsView(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<button on:click={openCollectiblesDetailsView} class="flex flex-col w-full ">
    <div class="bg-red-400 w-full flex-grow aspect-square overflow-hidden">
        <NftMedia nftId={nft.id} classes="bg-gray-200 dark:bg-gray-700 rounded-t-2xl object-cover" />
    </div>
    <div class="w-full flex flex-col justify-center p-3.5 bg-white dark:bg-gray-800 rounded-b-2xl">
        <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
    </div>
</button>

<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMedia } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { selectedNftId } from '@core/nfts/stores'

    export let nft: INft

    let nftWrapperClientWidth: number

    function openCollectiblesDetailsView(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<button
    on:click={openCollectiblesDetailsView}
    class="flex flex-col rounded-2xl overflow-hidden"
    style="height: {nftWrapperClientWidth}px;"
>
    <div class="w-full overflow-hidden flex-grow" bind:clientWidth={nftWrapperClientWidth}>
        <NftMedia nftId={nft.id} classes="bg-gray-200 dark:bg-gray-700 min-w-full min-h-full object-cover" />
    </div>
    <div class="w-full flex flex-col justify-center p-3.5 bg-white dark:bg-gray-800">
        <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
    </div>
</button>

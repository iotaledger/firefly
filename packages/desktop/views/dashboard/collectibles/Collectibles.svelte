<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { addNftToDownloadQueue, selectedAccountNfts } from '@core/nfts'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()

    // This is needed because we only want to call it when the account index changes, but not the selectedAccountNfts
    $: addSelectedAccountNftsToDownloadQueue($selectedAccountIndex)
    function addSelectedAccountNftsToDownloadQueue(accountIndex: number) {
        void addNftToDownloadQueue(accountIndex, $selectedAccountNfts)
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
</div>

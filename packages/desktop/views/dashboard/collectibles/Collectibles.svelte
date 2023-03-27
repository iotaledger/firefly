<script lang="ts">
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'

    import { selectedAccountIndex } from '@core/account/stores'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { downloadNftMedia, selectedAccountNfts } from '@core/nfts'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()
    $: downloadNftsForSelectedAccountNfts($selectedAccountIndex)

    // This is needed because we only want to call it when the account index changes, but not the selectedAccountNfts
    function downloadNftsForSelectedAccountNfts(accountIndex: number) {
        void downloadNftMedia(accountIndex, $selectedAccountNfts)
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

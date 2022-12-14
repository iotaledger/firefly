<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores/selected-account-id.store'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'

    $: $selectedAccountIndex && $collectiblesRouter.reset()
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
</div>

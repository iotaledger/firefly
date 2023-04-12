<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { collectiblesRoute, CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { CollectiblesDetailsView, CollectiblesGalleryView } from './views'

    $: $selectedAccountIndex !== undefined && $collectiblesRouter.reset()
</script>

<div class="h-full flex flex-col flex-nowrap relative flex-1">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <CollectiblesGalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <CollectiblesDetailsView />
    {/if}
</div>

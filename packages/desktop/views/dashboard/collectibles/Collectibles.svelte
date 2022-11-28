<script lang="ts">
    import { collectiblesRoute, CollectiblesRoute } from '@core/router'
    import { DetailsView, GalleryView } from './views'
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $collectiblesRoute === CollectiblesRoute.Gallery}
        <GalleryView />
    {/if}
    {#if $collectiblesRoute === CollectiblesRoute.Details}
        <DetailsView />
    {/if}
</div>

<script lang="ts">
    import { Pane } from 'shared/components'
    import { collectiblesRoute, CollectiblesRoute } from '@core/router'
    import { DetailsView, GalleryView } from './views'
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-1 gap-x-4 min-h-0">
        {#if $collectiblesRoute === CollectiblesRoute.Gallery}
            <Pane classes="p-6">
                <GalleryView />
            </Pane>
        {/if}
        {#if $collectiblesRoute === CollectiblesRoute.Details}
            <DetailsView />
        {/if}
    </div>
</div>

<script lang="ts">
    import { mobile } from '@core/app'
    import { isLocaleLoaded } from '@core/i18n'
    import { dashboardRouter, settingsRouter } from '@core/router'
    import { Icon } from '@ui'
    import { onDestroy } from 'svelte'
    import { SettingsViewer } from './views'

    export let handleClose: () => void = undefined

    function closeSettings(): void {
        $dashboardRouter.previous()
    }

    onDestroy((): void => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<div class="relative h-full w-full p-8 md:bg-white md:dark:bg-gray-900 flex flex-1">
    {#if !$mobile}
        <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
    {/if}
    <SettingsViewer />
</div>

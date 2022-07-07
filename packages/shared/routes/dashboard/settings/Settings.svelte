<script lang="typescript">
    import { Icon } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { isLocaleLoaded } from '@core/i18n'
    import { dashboardRouter, settingsRouter, settingsRoute, SettingsRoute } from '@core/router'
    import { onDestroy } from 'svelte'
    import { SettingsHome, SettingsViewer } from './views'
    import { fly } from 'svelte/transition'

    export let handleClose = (): void => {}

    function closeSettings(): void {
        $dashboardRouter.previous()
    }

    onDestroy(() => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<div
    class="relative h-full w-full px-0 md:px-16 md:py-12 md:bg-white md:dark:bg-gray-900 flex flex-1 {$mobile
        ? ''
        : 'pb-10'} {$settingsRoute === SettingsRoute.Init && $mobile && 'settings-wrapper md:pt-20'}"
    in:fly={{ duration: $mobile ? 200 : 0, x: 200 }}
>
    {#if !$mobile}
        <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
    {/if}
    {#if $settingsRoute === SettingsRoute.Init}
        <SettingsHome />
    {:else}
        <SettingsViewer />
    {/if}
</div>

<style>
    .settings-wrapper {
        padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
    }
</style>

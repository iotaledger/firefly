<script lang="typescript">
    import { appSettings } from '@core/app'

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode
</script>

<tab-pane
    class:darkmode={darkModeEnabled}
    class="w-full overflow-y-auto flex flex-auto h-1 p-5 pb-0 bg-white dark:bg-gray-800 rounded-t-2xl"
>
    <slot />
</tab-pane>

<style type="text/scss">
    tab-pane {
        box-shadow: 0px 4px 4px rgb(0 0 0 / 25%), 0px 2px 12px rgb(0 25 66 / 10%);
        &.darkmode {
            box-shadow: 0px 4px 4px rgb(0 0 0 / 25%), 0px 2px 12px rgb(0 25 66 / 20%);
        }
    }
</style>

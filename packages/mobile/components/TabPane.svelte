<script lang="ts">
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

<style lang="scss">
    tab-pane {
        box-shadow: 0px 0px 110px rgba(26, 101, 161, 0.15);
        clip-path: inset(-300px 0px 0px 0px); // needed to prevent the shadow from showing at the bottom
        &.darkmode {
            box-shadow: 0px 0px 110px rgba(26, 101, 161, 0.15);
        }
    }
</style>

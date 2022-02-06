<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    export let classes

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode
</script>

<div class:darkmode={darkModeEnabled} class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden {classes}">
    <slot />
</div>

<style type="text/scss">
    div {
        box-shadow: 0px 1px 4px rgba(23, 27, 37, 0.04);
        &.darkmode {
            box-shadow: 0px 1px 4px rgba(23, 27, 37, 0.04);
        }
    }
</style>

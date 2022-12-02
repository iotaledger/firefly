<script lang="typescript">
    import { appSettings } from '@core/app'

    export let classes = ''
    export let overflow = 'hidden'

    let darkModeEnabled: boolean
    $: darkModeEnabled = $appSettings.darkMode
</script>

<div
    class:darkmode={darkModeEnabled}
    class="bg-white dark:bg-gray-800 rounded-2xl overflow-{overflow} shadow-elevation-1 {classes}"
>
    <slot />
</div>

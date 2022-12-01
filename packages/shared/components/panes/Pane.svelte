<script lang="typescript">
    import { appSettings } from '@core/app'

    export let classes = ''
    export let overflow = 'hidden'
    export let removeShadow = false

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode
</script>

<div
    class:darkmode={darkModeEnabled}
    class:shadow-elevation-1={!removeShadow}
    class="bg-white dark:bg-gray-800 rounded-2xl overflow-{overflow} {classes}"
>
    <slot />
</div>

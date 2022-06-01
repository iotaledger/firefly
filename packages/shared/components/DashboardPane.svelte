<script lang="typescript">
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    export let classes

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode
</script>

<div
    class:darkmode={darkModeEnabled}
    class="bg-white dark:bg-gray-800 {$mobile
        ? 'rounded-t-2xl'
        : 'rounded-2xl'} overflow-hidden shadow-elevation-1 {classes}"
>
    <slot />
</div>

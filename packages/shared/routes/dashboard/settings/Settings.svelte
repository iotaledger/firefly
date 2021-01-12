<script lang="typescript">
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { SettingsHome, SettingsViewer } from './views'
    export let locale
    export let mobile
    
    const route = writable(undefined)
    setContext('route', route)
</script>

<div class="w-full h-full px-16 py-12 flex flex-1 bg-white">
    {#if $route}
        <SettingsViewer mobile={mobile} locale={locale} />
    {:else}
        <SettingsHome mobile={mobile} locale={locale} />
    {/if}
</div>

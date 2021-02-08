<script lang="typescript">
    import { setContext, createEventDispatcher } from 'svelte'
    import { get, writable } from 'svelte/store'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { activeProfile } from 'shared/lib/profile'
    import { SettingsTitles } from './types'

    import { SettingsHome, SettingsViewer } from './views'
    export let locale
    export let mobile

    const route = writable(undefined)
    setContext('route', route)

    const dispatch = createEventDispatcher()

    function navigate(params) {
        dispatch('next', params)
    }

    $: {
        if ($deepLinkRequestActive && !get(activeProfile).settings.deepLinking) {
            route.set(SettingsTitles.AdvancedSettings)
            deepLinkRequestActive.set(false)
        }
    }
</script>

<div class="w-full h-full px-16 py-12 flex flex-1 bg-white">
    {#if $route}
        <SettingsViewer {mobile} {locale} {navigate} />
    {:else}
        <SettingsHome {mobile} {locale} />
    {/if}
</div>

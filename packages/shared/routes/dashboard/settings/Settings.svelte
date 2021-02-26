<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { activeProfile } from 'shared/lib/profile'
    import { settingsRoute } from 'shared/lib/router'
    import { SettingsRoutes } from 'shared/lib/typings/routes'

    import { SettingsHome, SettingsViewer } from './views'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function navigate(params) {
        dispatch('next', params)
    }

    $: {
        if ($deepLinkRequestActive && !get(activeProfile).settings.deepLinking) {
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            deepLinkRequestActive.set(false)
        }
    }
</script>

<div class="w-full h-full px-16 py-12 flex flex-1 bg-white">
    {#if $settingsRoute === SettingsRoutes.Init}
        <SettingsHome {mobile} {locale} />
    {:else}
        <SettingsViewer {mobile} {locale} {navigate} />
    {/if}
</div>

<script lang="ts">
    import { Scroller } from '@components'
    import { _ } from '@core/i18n'
    import { settingsRoute, settingsRouter } from '@core/router'
    import { onMount } from 'svelte'
    import { SettingsListForCategory, SettingsNavigator } from './'

    function scrollIntoView(id: string, options = null): void {
        if (id) {
            const elem = document.getElementById(id)
            if (elem) {
                elem.scrollIntoView(options ?? { behavior: 'smooth' })
            } else {
                console.error(`Element with id "${id}" missing in scrollIntoView`)
            }
        }
    }

    onMount(() => {
        const child = $settingsRouter.getChildRouteAndReset()
        if (child) {
            scrollIntoView(child, { behavior: 'auto' })
        }
    })
</script>

{#key $_}
    <settings-viewer class="flex flex-1 flex-row items-start">
        <SettingsNavigator bind:currentCategory={$settingsRoute} onSettingClick={(id) => scrollIntoView(id)} />
        <div class="h-full w-full">
            <Scroller classes="w-3/4 h-full pr-100" threshold={100}>
                <div class="w-11/12">
                    <SettingsListForCategory category={$settingsRoute} />
                </div>
            </Scroller>
        </div>
    </settings-viewer>
{/key}

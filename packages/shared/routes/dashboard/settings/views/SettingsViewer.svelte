<script lang="typescript">
    import { Icon, Scroller, SettingsNavigator, Text } from 'shared/components'
    import { settingsRoute } from 'shared/lib/router'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { AdvancedSettings, GeneralSettings, HelpAndInfo, SecuritySettings, SettingsRoutes } from 'shared/lib/typings/routes'
    import { Advanced, General, Security } from './'
    export let locale
    export let mobile

    export let navigate

    let scroller
    let index

    const routes = Object.values(SettingsRoutes).filter((route) => route !== SettingsRoutes.Init)

    const settings = {
        generalSettings: GeneralSettings,
        security: SecuritySettings,
        advancedSettings: AdvancedSettings,
        helpAndInfo: HelpAndInfo,
    }

    function scrollIntoView(id) {
        if (id) {
            const elem = document.getElementById(id)
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
            } else {
                console.error(`Element with id "${id}" missing in scrollIntoView`)
            }
        }
    }
    function goToSettingsHome() {
        settingsRoute.set(SettingsRoutes.Init)
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="relative flex flex-1 flex-row items-start">
        <button on:click={goToSettingsHome} class="absolute top-0 right-0">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
        <SettingsNavigator
            {routes}
            onSettingClick={(id) => scrollIntoView(id)}
            icons={SettingsIcons}
            {settings}
            {locale}
            bind:route={$settingsRoute} />
        <div class="h-full w-full pb-10">
            <Text type="p" secondary highlighted classes="mb-8">
                {locale('views.settings.settings')}
                /
                {locale(`views.settings.${$settingsRoute}.title`)}
            </Text>
            <Scroller classes="w-3/4 h-full pr-100" threshold={70} bind:index bind:this={scroller}>
                <div class="w-11/12">
                    <Text type="h2" classes="mb-7">{locale(`views.settings.${$settingsRoute}.title`)}</Text>
                    {#if $settingsRoute === 'generalSettings'}
                        <General {locale} />
                    {:else if $settingsRoute === 'security'}
                        <Security {navigate} {locale} />
                    {:else if $settingsRoute === 'advancedSettings'}
                        <Advanced {locale} />
                    {:else if $settingsRoute === 'helpAndInfo'}
                        <div />
                    {/if}
                </div>
            </Scroller>
        </div>
    </div>
{/if}

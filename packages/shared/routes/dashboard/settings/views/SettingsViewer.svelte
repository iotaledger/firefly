<script lang="typescript">
    import { SettingsRoutes, GeneralSettings, SecuritySettings, AdvancedSettings, HelpAndInfo } from 'shared/lib/typings/routes'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { settingsRoute } from 'shared/lib/router'
    import { SettingsNavigator, Text, Scroller } from 'shared/components'
    import { profileType, ProfileType } from 'shared/lib/wallet'
    import { General, Security, Advanced } from './'

    export let locale
    export let mobile

    export let navigate

    let scroller
    let index

    const routes = Object.values(SettingsRoutes).filter((route) => route !== SettingsRoutes.Init)

    const securitySettings = Object.assign({}, SecuritySettings)
        if ($profileType !== ProfileType.Software) {
            delete securitySettings.ExportStronghold
            delete securitySettings.ChangePassword
        }

    const settings = {
        generalSettings: GeneralSettings,
        security: securitySettings,
        advancedSettings: AdvancedSettings,
        helpAndInfo: HelpAndInfo,
    }

    function scrollIntoView(id) {
        if (id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="flex flex-1 flex-row items-start">
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

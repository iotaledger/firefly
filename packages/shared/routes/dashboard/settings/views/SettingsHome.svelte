<script lang="typescript">
    import { SettingsMenu, Text } from 'shared/components'
    import { settingsChildRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { AdvancedSettings, GeneralSettings, HelpAndInfo, SecuritySettings, SettingsRoutes } from 'shared/lib/typings/routes'

    export let locale
    export let mobile
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="h-full w-full flex flex-col">
        <Text type="h2" classes="mb-14">{locale('views.settings.settings')}</Text>
        <div class="flex flex-row items-start space-x-10">
            <SettingsMenu
                icon="settings"
                iconColor="bg-blue-500"
                icons={SettingsIcons}
                settings={GeneralSettings}
                title={locale('views.settings.generalSettings.title')}
                description={locale('views.settings.generalSettings.description')}
                onClick={(setting) => {
                    settingsRoute.set(SettingsRoutes.GeneralSettings)
                    settingsChildRoute.set(setting)
                }}
                {locale} />
            <SettingsMenu
                icon="security"
                iconColor="bg-yellow-500"
                icons={SettingsIcons}
                settings={SecuritySettings}
                title={locale('views.settings.security.title')}
                description={locale('views.settings.security.description')}
                onClick={(setting) => {
                    settingsRoute.set(SettingsRoutes.Security)
                    settingsChildRoute.set(setting)
                }}
                {locale} />
            <SettingsMenu
                icon="tools"
                iconColor="bg-green-600"
                icons={SettingsIcons}
                settings={AdvancedSettings}
                title={locale('views.settings.advancedSettings.title')}
                description={locale('views.settings.advancedSettings.description')}
                onClick={(setting) => {
                    settingsRoute.set(SettingsRoutes.AdvancedSettings)
                    settingsChildRoute.set(setting)
                }}
                {locale} />
            <SettingsMenu
                icon="info"
                iconColor="bg-purple-500"
                icons={SettingsIcons}
                settings={HelpAndInfo}
                title={locale('views.settings.helpAndInfo.title')}
                description={locale('views.settings.helpAndInfo.description')}
                onClick={(setting) => {
                    settingsRoute.set(SettingsRoutes.HelpAndInfo)
                    settingsChildRoute.set(setting)
                }}
                {locale} />
        </div>
    </div>
{/if}

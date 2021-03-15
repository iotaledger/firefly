<script lang="typescript">
    import { Icon, SettingsMenu, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { appRoute, lastAppRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
        SettingsRoutes,
    } from 'shared/lib/typings/routes'

    export let locale
    export let mobile

    const closeSettingsHome = () => {
        appRoute.set($lastAppRoute)
        lastAppRoute.set(null)
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="h-full w-full flex flex-col">
        <div class="flex flex-row justify-between mb-14">
            <Text type="h2">{locale('views.settings.settings')}</Text>
            {#if !$loggedIn}
                <button on:click={closeSettingsHome}>
                    <Icon icon="close" classes="text-gray-800 dark:text-white" />
                </button>
            {/if}
        </div>
        <div class="flex flex-row items-start space-x-10">
            <SettingsMenu
                icon="settings"
                iconColor="bg-blue-500"
                icons={SettingsIcons}
                settings={$loggedIn ? GeneralSettings : GeneralSettingsNoProfile}
                title={locale('views.settings.generalSettings.title')}
                description={locale('views.settings.generalSettings.description')}
                onClick={() => settingsRoute.set(SettingsRoutes.GeneralSettings)}
                {locale} />
            {#if $loggedIn}
                <SettingsMenu
                    icon="security"
                    iconColor="bg-yellow-500"
                    icons={SettingsIcons}
                    settings={SecuritySettings}
                    title={locale('views.settings.security.title')}
                    description={locale('views.settings.security.description')}
                    onClick={() => settingsRoute.set(SettingsRoutes.Security)}
                    {locale} />
            {/if}
            <SettingsMenu
                icon="tools"
                iconColor="bg-green-600"
                icons={SettingsIcons}
                settings={$loggedIn ? AdvancedSettings : AdvancedSettingsNoProfile}
                title={locale('views.settings.advancedSettings.title')}
                description={locale('views.settings.advancedSettings.description')}
                onClick={() => settingsRoute.set(SettingsRoutes.AdvancedSettings)}
                {locale} />
            <SettingsMenu
                icon="info"
                iconColor="bg-purple-500"
                icons={SettingsIcons}
                settings={HelpAndInfo}
                title={locale('views.settings.helpAndInfo.title')}
                description={locale('views.settings.helpAndInfo.description')}
                onClick={() => settingsRoute.set(SettingsRoutes.HelpAndInfo)}
                {locale} />
        </div>
    </div>
{/if}

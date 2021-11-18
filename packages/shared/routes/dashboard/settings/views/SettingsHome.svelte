<script lang="typescript">
    import { SettingsMenu, Text } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { openUrl } from 'shared/lib/device'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { settingsChildRoute, settingsRoute } from 'shared/lib/router'
    import { Locale } from 'shared/lib/typings/i18n'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        ExternalRoute,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
        SettingsRoutes,
    } from 'shared/lib/typings/routes'

    export let locale: Locale

    const securitySettings = Object.assign({}, SecuritySettings)
    const advancedSettings = Object.assign({}, AdvancedSettings)

    // TODO: ledger, The operand of a 'delete' operator cannot be a read-only property
    $: if (!$isSoftwareProfile) {
        delete securitySettings.ExportStronghold
        delete securitySettings.ChangePassword
    }
    $: if (!$isLedgerProfile) {
        delete advancedSettings.MigrateLedgerIndex
    }

    function onSettingClick(
        route: SettingsRoutes,
        childRoute:
            | SecuritySettings
            | AdvancedSettings
            | GeneralSettings
            | GeneralSettingsNoProfile
            | AdvancedSettingsNoProfile
            | HelpAndInfo
    ) {
        if (route === SettingsRoutes.HelpAndInfo && $mobile) {
            switch (childRoute) {
                case HelpAndInfo.Documentation:
                    openUrl(ExternalRoute.Documentation)
                    break
                case HelpAndInfo.Discord:
                    openUrl(ExternalRoute.Discord)
                    break
                case HelpAndInfo.FAQ:
                    openUrl(ExternalRoute.FAQ)
                    break
                case HelpAndInfo.ReportAnIssue:
                    openUrl(ExternalRoute.FAQ)
                    break
            }
        } else {
            settingsRoute.set(route)
            settingsChildRoute.set(childRoute)
        }
    }
</script>

<div class="flex flex-col flex-1 md:flex-initial pb-10 md:pb-0 md:h-full md:w-full">
    {#if !$mobile}
        <Text type="h2" classes="mb-14">{locale('views.settings.settings')}</Text>
    {/if}
    <div class="flex items-start {$mobile ? 'flex-col gap-5 md:p-6' : 'flex-row  space-x-10'}">
        <SettingsMenu
            icons={SettingsIcons}
            settings={GeneralSettings}
            activeSettings={$loggedIn ? GeneralSettings : GeneralSettingsNoProfile}
            title={locale('views.settings.generalSettings.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoutes.GeneralSettings, setting)}
            {locale} />
        <SettingsMenu
            icons={SettingsIcons}
            settings={securitySettings}
            activeSettings={$loggedIn ? SecuritySettings : undefined}
            title={locale('views.settings.security.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoutes.Security, setting)}
            {locale} />
        <SettingsMenu
            icons={SettingsIcons}
            settings={advancedSettings}
            activeSettings={$loggedIn ? advancedSettings : AdvancedSettingsNoProfile}
            title={locale('views.settings.advancedSettings.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoutes.AdvancedSettings, setting)}
            {locale} />
        <SettingsMenu
            icons={SettingsIcons}
            settings={HelpAndInfo}
            activeSettings={HelpAndInfo}
            title={locale('views.settings.helpAndInfo.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoutes.HelpAndInfo, setting)}
            {locale} />
    </div>
</div>

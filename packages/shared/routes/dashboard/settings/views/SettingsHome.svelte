<script lang="typescript">
    import { SettingsMenu, Text } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { Platform } from 'shared/lib/platform'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        ExternalRoute,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
        SettingsRoute,
        settingsRouter,
    } from '@core/router'

    // TODO: Notification settings have to be enabled again when system notifications are implemented for mobile
    const { NetworkStatus, Notifications, ...generalSettingsMobile } = GeneralSettings
    const { CrashReporting, MigrateLedgerIndex, DeepLinks, ...advancedSettingsMobile } = AdvancedSettings
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
        route: SettingsRoute,
        childRoute:
            | SecuritySettings
            | AdvancedSettings
            | GeneralSettings
            | GeneralSettingsNoProfile
            | AdvancedSettingsNoProfile
            | HelpAndInfo
    ) {
        if (route === SettingsRoute.HelpAndInfo && $mobile) {
            switch (childRoute) {
                case HelpAndInfo.Documentation:
                    Platform.openUrl(ExternalRoute.Documentation)
                    break
                case HelpAndInfo.Discord:
                    Platform.openUrl(ExternalRoute.Discord)
                    break
                case HelpAndInfo.FAQ:
                    Platform.openUrl(ExternalRoute.FAQ)
                    break
                case HelpAndInfo.ReportAnIssue:
                    Platform.openUrl(ExternalRoute.IssueReport)
                    break
            }
        } else {
            $settingsRouter.goToChildRoute(route, childRoute)
        }
    }
</script>

<div class="flex flex-col flex-1 md:flex-initial pb-10 md:pb-0 md:h-full md:w-full">
    {#if !$mobile}
        <Text type="h2" classes="mb-14">{localize('views.settings.settings')}</Text>
    {/if}
    <div class="flex items-start {$mobile ? 'flex-col space-y-10' : 'flex-row  space-x-10'}">
        <SettingsMenu
            icon="settings"
            iconColor="bg-blue-500"
            icons={SettingsIcons}
            settings={$mobile ? generalSettingsMobile : GeneralSettings}
            activeSettings={$loggedIn ? GeneralSettings : GeneralSettingsNoProfile}
            title={localize('views.settings.generalSettings.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoute.GeneralSettings, setting)}
        />
        <SettingsMenu
            icon="security"
            iconColor="bg-yellow-500"
            icons={SettingsIcons}
            settings={securitySettings}
            activeSettings={$loggedIn ? SecuritySettings : undefined}
            title={localize('views.settings.security.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoute.Security, setting)}
        />
        <SettingsMenu
            icon="tools"
            iconColor="bg-green-600"
            icons={SettingsIcons}
            settings={$mobile ? advancedSettingsMobile : advancedSettings}
            activeSettings={$loggedIn ? advancedSettings : AdvancedSettingsNoProfile}
            title={localize('views.settings.advancedSettings.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoute.AdvancedSettings, setting)}
        />
        <SettingsMenu
            icon="info"
            iconColor="bg-purple-500"
            icons={SettingsIcons}
            settings={HelpAndInfo}
            activeSettings={HelpAndInfo}
            title={localize('views.settings.helpAndInfo.title')}
            description=""
            onClick={(setting) => onSettingClick(SettingsRoute.HelpAndInfo, setting)}
        />
    </div>
</div>

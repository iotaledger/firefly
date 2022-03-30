<script lang="typescript">
    import { SettingsMenu, Text } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
        SettingsRoute,
        settingsRouter,
    } from '@core/router'

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
        $settingsRouter.goToChildRoute(route, childRoute)
    }
</script>

<div class="h-full w-full flex flex-col">
    {#if !$mobile}
        <Text type="h2" classes="mb-14">{localize('views.settings.settings')}</Text>
    {/if}
    <div class="flex items-start {$mobile ? 'flex-col gap-5 md:p-6' : 'flex-row  space-x-10'}">
        <SettingsMenu
            icon="settings"
            iconColor="bg-blue-500"
            icons={SettingsIcons}
            settings={GeneralSettings}
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
            settings={advancedSettings}
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

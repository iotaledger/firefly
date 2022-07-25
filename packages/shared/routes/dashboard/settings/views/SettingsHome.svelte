<script lang="typescript">
    import { SettingsMenu, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import {
        AdvancedSettingsRoute,
        AdvancedSettingsRouteNoProfile,
        GeneralSettingsRoute,
        GeneralSettingsRouteNoProfile,
        HelpAndInfoRoute,
        SecuritySettingsRoute,
        SettingsRoute,
        settingsRouter,
    } from '@core/router'
    import features from 'shared/features/features'
    import { TextType } from 'shared/components/Text.svelte'

    const { loggedIn } = $activeProfile

    const securitySettings = Object.assign({}, SecuritySettingsRoute)
    const advancedSettings = Object.assign({}, AdvancedSettingsRoute)

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
            | SecuritySettingsRoute
            | AdvancedSettingsRoute
            | GeneralSettingsRoute
            | GeneralSettingsRouteNoProfile
            | AdvancedSettingsRouteNoProfile
            | HelpAndInfoRoute
    ) {
        $settingsRouter.goToChildRoute(route, childRoute)
    }
</script>

<div class="h-full w-full flex flex-col">
    {#if !$mobile}
        <Text type={TextType.h2} classes="mb-14">{localize('views.settings.settings')}</Text>
    {/if}
    <div class="flex items-start {$mobile ? 'flex-col gap-5 md:p-6' : 'flex-row  space-x-10'}">
        {#if features?.settings?.general?.enabled}
            <SettingsMenu
                icon="settings"
                iconColor="bg-blue-500"
                group="general"
                settings={GeneralSettingsRoute}
                activeSettings={$loggedIn ? GeneralSettingsRoute : GeneralSettingsRouteNoProfile}
                title={localize('views.settings.general.title')}
                description=""
                onClick={(setting) => onSettingClick(SettingsRoute.General, setting)}
            />
        {/if}
        {#if features?.settings?.security?.enabled}
            <SettingsMenu
                icon="security"
                iconColor="bg-yellow-500"
                group="security"
                settings={securitySettings}
                activeSettings={$loggedIn ? SecuritySettingsRoute : undefined}
                title={localize('views.settings.security.title')}
                description=""
                onClick={(setting) => onSettingClick(SettingsRoute.Security, setting)}
            />
        {/if}
        {#if features?.settings?.advanced?.enabled}
            <SettingsMenu
                icon="tools"
                iconColor="bg-green-600"
                group="advanced"
                settings={advancedSettings}
                activeSettings={$loggedIn ? advancedSettings : AdvancedSettingsRouteNoProfile}
                title={localize('views.settings.advanced.title')}
                description=""
                onClick={(setting) => onSettingClick(SettingsRoute.Advanced, setting)}
            />
        {/if}
        {#if features?.settings?.helpAndInfo?.enabled}
            <SettingsMenu
                icon="info"
                iconColor="bg-purple-500"
                group="helpAndInfo"
                settings={HelpAndInfoRoute}
                activeSettings={HelpAndInfoRoute}
                title={localize('views.settings.helpAndInfo.title')}
                description=""
                onClick={(setting) => onSettingClick(SettingsRoute.HelpAndInfo, setting)}
            />
        {/if}
    </div>
</div>

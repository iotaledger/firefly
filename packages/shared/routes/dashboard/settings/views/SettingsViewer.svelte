<script lang="typescript">
    import { Scroller, SettingsNavigator, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize, _ } from '@core/i18n'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
    import {
        AdvancedSettingsNoProfile,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SettingsRoute,
        SettingsRouteNoProfile,
        settingsRouter,
        settingsRoute,
        SecuritySettings,
        AdvancedSettings,
    } from '@core/router'
    import { onMount } from 'svelte'
    import { Advanced, General, Help, Security } from './'
    import features from 'shared/features/features'

    const { loggedIn } = $activeProfile

    const routes = Object.values($loggedIn ? SettingsRoute : SettingsRouteNoProfile).filter(
        (route) => route !== SettingsRoute.Init
    )

    let settings

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

    if ($loggedIn) {
        settings = {
            general: GeneralSettings,
            security: securitySettings,
            advanced: advancedSettings,
            helpAndInfo: HelpAndInfo,
        }
    } else {
        settings = {
            general: GeneralSettingsNoProfile,
            advanced: AdvancedSettingsNoProfile,
            helpAndInfo: HelpAndInfo,
        }
    }

    $: Object.keys(features?.settings)?.forEach((group) => {
        if (features?.settings?.[group]?.enabled) {
            Object.keys(features?.settings?.[group])?.forEach((setting) => {
                if (!features?.settings?.[group]?.[setting]?.enabled) {
                    const settingName = setting[0].toUpperCase() + setting.slice(1)
                    delete settings?.[group]?.[settingName]
                }
            })
        } else {
            delete settings?.[group]
        }
    })

    function scrollIntoView(id: string, options = null) {
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
    <div class="flex flex-1 flex-row items-start">
        {#if !$mobile}
            <SettingsNavigator
                {routes}
                onSettingClick={(id) => scrollIntoView(id)}
                icons={SETTINGS_ICON_SVG}
                {settings}
                bind:route={$settingsRoute}
            />
        {/if}
        <div class="h-full w-full pb-10">
            {#if !$mobile}
                <Text type="p" secondary highlighted classes="mb-8">
                    {localize('views.settings.settings')}
                    /
                    {localize(`views.settings.${$settingsRoute}.title`)}
                </Text>
            {/if}
            <Scroller classes="w-full md:w-3/4 h-full md:pr-100" threshold={70}>
                <div class="md:w-11/12">
                    {#if !$mobile}
                        <Text type="h2" classes="mb-7">{localize(`views.settings.${$settingsRoute}.title`)}</Text>
                    {/if}
                    {#if $settingsRoute === SettingsRoute.General}
                        <General />
                    {:else if $settingsRoute === SettingsRoute.Security}
                        <Security />
                    {:else if $settingsRoute === SettingsRoute.Advanced}
                        <Advanced />
                    {:else if $settingsRoute === SettingsRoute.HelpAndInfo}
                        <Help />
                    {/if}
                </div>
            </Scroller>
        </div>
    </div>
{/key}

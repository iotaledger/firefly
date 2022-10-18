<script lang="typescript">
    import { onMount } from 'svelte'
    import { Scroller, SettingsNavigator, Text, TextType } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize, _ } from '@core/i18n'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
    import {
        AdvancedSettingsRoute,
        AdvancedSettingsRouteNoProfile,
        GeneralSettingsRoute,
        GeneralSettingsRouteNoProfile,
        HelpAndInfoRoute,
        SecuritySettingsRoute,
        SettingsRoute,
        settingsRoute,
        SettingsRouteNoProfile,
        settingsRouter,
    } from '@core/router'
    import { Advanced, General, Help, Security } from './'

    const { loggedIn } = $activeProfile

    const routes = Object.values($loggedIn ? SettingsRoute : SettingsRouteNoProfile).filter(
        (route) => route !== SettingsRoute.Init
    )

    let settings

    const securitySettings = Object.assign({}, SecuritySettingsRoute)
    const advancedSettings = Object.assign({}, AdvancedSettingsRoute)

    // TODO: ledger, The operand of a 'delete' operator cannot be a read-only property
    $: if (!$isSoftwareProfile) {
        delete securitySettings.ExportStronghold
        delete securitySettings.ChangePassword
    }
    $: if (!$isActiveLedgerProfile) {
        delete advancedSettings.MigrateLedgerIndex
    }

    if ($loggedIn) {
        settings = {
            general: GeneralSettingsRoute,
            security: securitySettings,
            advanced: advancedSettings,
            helpAndInfo: HelpAndInfoRoute,
        }
    } else {
        settings = {
            general: GeneralSettingsRouteNoProfile,
            advanced: AdvancedSettingsRouteNoProfile,
            helpAndInfo: HelpAndInfoRoute,
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
    <div class="flex flex-1 flex-row items-start">
        {#if !$mobile}
            <SettingsNavigator
                {routes}
                onSettingClick={(id) => scrollIntoView(id)}
                {settings}
                bind:route={$settingsRoute}
            />
        {/if}
        <div class="h-full w-full pb-10">
            {#if !$mobile}
                <Text type={TextType.p} secondary highlighted classes="mb-8">
                    {localize('views.settings.settings')}
                    /
                    {localize(`views.settings.${$settingsRoute}.title`)}
                </Text>
            {/if}
            <Scroller classes="w-full md:w-3/4 h-full md:pr-100" threshold={70}>
                <div class="md:w-11/12">
                    {#if !$mobile}
                        <Text type={TextType.h2} classes="mb-7"
                            >{localize(`views.settings.${$settingsRoute}.title`)}</Text
                        >
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

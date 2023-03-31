<script lang="typescript">
    import { Scroller, SettingsNavigator, Text } from 'shared/components'
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
        SettingsRouteNoProfile,
        settingsRouter,
        settingsRoute,
    } from '@core/router'
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
    import { Advanced, General, Help, Security } from './'

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
            generalSettings: GeneralSettings,
            security: securitySettings,
            advancedSettings: advancedSettings,
            helpAndInfo: HelpAndInfo,
        }
    } else {
        settings = {
            generalSettings: GeneralSettingsNoProfile,
            advancedSettings: AdvancedSettingsNoProfile,
            helpAndInfo: HelpAndInfo,
        }
    }

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
        if (!$mobile) {
            const child = $settingsRouter.getChildRouteAndReset()
            if (child) {
                scrollIntoView(child, { behavior: 'auto' })
            }
        }
    })
</script>

<div class="flex flex-1 flex-row items-start" in:fly={{ duration: $mobile ? 200 : 0, x: 200 }}>
    {#if !$mobile}
        <SettingsNavigator
            {routes}
            onSettingClick={(id) => scrollIntoView(id)}
            icons={SettingsIcons}
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
        <Scroller classes="w-full md:w-3/4 h-full md:pr-100 {$mobile && 'contents'}" threshold={70}>
            <div class="md:w-11/12">
                {#if !$mobile}
                    <Text type="h2" classes="mb-7">{localize(`views.settings.${$settingsRoute}.title`)}</Text>
                {/if}
                {#if $settingsRoute === SettingsRoute.GeneralSettings}
                    <General />
                {:else if $settingsRoute === SettingsRoute.Security}
                    <Security />
                {:else if $settingsRoute === SettingsRoute.AdvancedSettings}
                    <Advanced />
                {:else if $settingsRoute === SettingsRoute.HelpAndInfo}
                    <Help />
                {/if}
            </div>
        </Scroller>
    </div>
</div>

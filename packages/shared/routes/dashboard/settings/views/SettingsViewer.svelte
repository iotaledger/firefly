<script lang="typescript">
    import { Icon, Scroller, SettingsNavigator, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { settingsChildRoute, settingsRoute } from 'shared/lib/router'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
        SettingsRoutes,
        SettingsRoutesNoProfile,
    } from 'shared/lib/typings/routes'
    import { onMount } from 'svelte'
    import { Advanced, General, Help, Security } from './'

    const routes = Object.values($loggedIn ? SettingsRoutes : SettingsRoutesNoProfile).filter(
        (route) => route !== SettingsRoutes.Init
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

    function scrollIntoView(id, options = null) {
        if (id) {
            const elem = document.getElementById(id)
            if (elem) {
                elem.scrollIntoView(options ?? { behavior: 'smooth' })
            } else {
                console.error(`Element with id "${id}" missing in scrollIntoView`)
            }
        }
    }

    function handleBackClick() {
        settingsRoute.set(SettingsRoutes.Init)
    }
    onMount(() => {
        const child = $settingsChildRoute
        settingsChildRoute.set(null)
        if (child) {
            scrollIntoView(child, { behavior: 'auto' })
        }
    })
</script>

<div class="flex flex-1 flex-row items-start">
    <button data-label="back-button" class="absolute top-8 left-8" on:click={handleBackClick}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{localize('actions.back')}</Text>
        </div>
    </button>
    <SettingsNavigator
        {routes}
        onSettingClick={(id) => scrollIntoView(id)}
        icons={SettingsIcons}
        {settings}
        bind:route={$settingsRoute} />
    <div class="h-full w-full pb-10">
        <Text type="p" secondary highlighted classes="mb-8">
            {localize('views.settings.settings')}
            /
            {localize(`views.settings.${$settingsRoute}.title`)}
        </Text>
        <Scroller classes="w-full md:w-3/4 h-full md:pr-100" threshold={70}>
            <div class="md:w-11/12">
                <Text type="h2" classes="mb-7">{localize(`views.settings.${$settingsRoute}.title`)}</Text>
                {#if $settingsRoute === SettingsRoutes.GeneralSettings}
                    <General />
                {:else if $settingsRoute === SettingsRoutes.Security}
                    <Security />
                {:else if $settingsRoute === SettingsRoutes.AdvancedSettings}
                    <Advanced />
                {:else if $settingsRoute === SettingsRoutes.HelpAndInfo}
                    <Help />
                {/if}
            </div>
        </Scroller>
    </div>
</div>

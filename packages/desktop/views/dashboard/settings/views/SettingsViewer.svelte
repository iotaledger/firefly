<script lang="ts">
    import { Scroller, SettingsNavigator, SettingsNavigatorTypes } from '@components'
    import { _ } from '@core/i18n'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
    import {
        AdvancedSettingsRoute,
        GeneralSettingsRoute,
        HelpAndInfoRoute,
        ProfileSettingsRoute,
        SecuritySettingsRoute,
        settingsRoute,
        SettingsRoute,
        SettingsRouteNoProfile,
        settingsRouter,
    } from '@core/router'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { Advanced, General, Help, ProfileSettings, Security } from './'

    const { loggedIn } = $activeProfile

    const routes = Object.values($loggedIn ? SettingsRoute : SettingsRouteNoProfile)

    const securitySettings = structuredClone(SecuritySettingsRoute)
    const advancedSettings = structuredClone(AdvancedSettingsRoute)

    let settings: SettingsNavigatorTypes.Settings

    $: if (!$isSoftwareProfile) {
        delete securitySettings.ExportStronghold
        delete securitySettings.ChangePassword
    }
    $: if (!$isActiveLedgerProfile) {
        delete advancedSettings.MigrateLedgerIndex
    }

    $: if ($loggedIn) {
        settings = {
            general: GeneralSettingsRoute,
            profile: ProfileSettingsRoute,
            security: securitySettings,
            advanced: advancedSettings,
            helpAndInfo: HelpAndInfoRoute,
        }
    } else {
        settings = {
            general: GeneralSettingsRoute,
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
    <settings-viewer class="flex flex-1 flex-row items-start">
        <SettingsNavigator
            {routes}
            onSettingClick={(id) => scrollIntoView(id)}
            {settings}
            bind:route={$settingsRoute}
        />
        <div class="h-full w-full pb-10">
            <Scroller classes="w-full md:w-3/4 h-full md:pr-100" threshold={100}>
                <div class="md:w-11/12">
                    {#if $settingsRoute === SettingsRoute.General}
                        <General />
                    {:else if $settingsRoute === SettingsRoute.Profile}
                        <ProfileSettings />
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
    </settings-viewer>
{/key}

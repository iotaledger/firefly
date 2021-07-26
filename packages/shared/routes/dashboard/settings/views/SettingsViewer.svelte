<script lang="typescript">
    import { Icon, Scroller, SettingsNavigator, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { isSoftwareProfile } from 'shared/lib/profile'
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

    export let locale
    export let mobile

    let scroller
    let index

    const routes = Object.values($loggedIn ? SettingsRoutes : SettingsRoutesNoProfile).filter(
        (route) => route !== SettingsRoutes.Init
    )

    let settings

    const securitySettings = Object.assign({}, SecuritySettings)

    // TODO: ledger, The operand of a 'delete' operator cannot be a read-only property
    $: if (!$isSoftwareProfile) {
        delete securitySettings.ExportStronghold
        delete securitySettings.ChangePassword
    }

    if ($loggedIn) {
        settings = {
            generalSettings: GeneralSettings,
            security: securitySettings,
            advancedSettings: AdvancedSettings,
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

{#if mobile}
    <div>foo</div>
{:else}
    <div class="flex flex-1 flex-row items-start">
        <button data-label="back-button" class="absolute top-8 left-8" on:click={handleBackClick}>
            <div class="flex items-center space-x-3">
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h5">{locale('actions.back')}</Text>
            </div>
        </button>
        <SettingsNavigator
            {routes}
            onSettingClick={(id) => scrollIntoView(id)}
            icons={SettingsIcons}
            {settings}
            {locale}
            bind:route={$settingsRoute} />
        <div class="h-full w-full pb-10">
            <Text type="p" secondary highlighted classes="mb-8">
                {locale('views.settings.settings')}
                /
                {locale(`views.settings.${$settingsRoute}.title`)}
            </Text>
            <Scroller classes="w-3/4 h-full pr-100" threshold={70} bind:index bind:this={scroller}>
                <div class="w-11/12">
                    <Text type="h2" classes="mb-7">{locale(`views.settings.${$settingsRoute}.title`)}</Text>
                    {#if $settingsRoute === 'generalSettings'}
                        <General {locale} />
                    {:else if $settingsRoute === 'security'}
                        <Security {locale} />
                    {:else if $settingsRoute === 'advancedSettings'}
                        <Advanced {locale} />
                    {:else if $settingsRoute === 'helpAndInfo'}
                        <Help {locale} />
                    {/if}
                </div>
            </Scroller>
        </div>
    </div>
{/if}

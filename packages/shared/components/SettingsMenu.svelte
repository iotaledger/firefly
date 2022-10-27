<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        AdvancedSettingsRoute,
        AdvancedSettingsRouteNoProfile,
        GeneralSettingsRoute,
        GeneralSettingsRouteNoProfile,
        HelpAndInfoRoute,
        SecuritySettingsRoute,
    } from '@core/router'
    import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
    import { Icon, Text, TextType } from 'shared/components'
    import features from '@features/features'

    export let group: string
    export let settings:
        | AdvancedSettingsRoute
        | AdvancedSettingsRouteNoProfile
        | GeneralSettingsRoute
        | GeneralSettingsRouteNoProfile
        | HelpAndInfoRoute
        | SecuritySettingsRoute
    export let activeSettings:
        | AdvancedSettingsRoute[]
        | AdvancedSettingsRouteNoProfile[]
        | GeneralSettingsRoute[]
        | GeneralSettingsRouteNoProfile[]
        | HelpAndInfoRoute[]
        | SecuritySettingsRoute[] = []
    export let icon = undefined
    export let iconColor = undefined
    export let title: string
    export let description: string
    export let onClick: (..._: any[]) => void

    $: Object.keys(features?.settings?.[group])?.forEach((setting) => {
        if (!features?.settings?.[group]?.[setting]?.enabled) {
            const settingName = setting[0].toUpperCase() + setting.slice(1)
            delete settings?.[settingName]
        }
    })
</script>

<div class="flex-1 {$mobile && 'w-full'}">
    <Icon width="24" height="24" boxed {icon} classes="text-white" boxClasses={`mb-5 ${iconColor}`} />
    <Text type={TextType.h4} classes="mb-2">{title}</Text>
    <Text type={TextType.p} classes="mb-4" secondary>{description}</Text>
    {#each Object.values(settings) as setting}
        <button
            on:click={() => onClick(setting)}
            class="{$mobile &&
                'w-full'} group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-2 rounded-lg w-3/4 text-left {!Object.values(
                activeSettings
            ).includes(setting) && 'opacity-20 pointer-events-none'}"
            disabled={!Object.values(activeSettings).includes(setting)}
        >
            <Icon
                width="24"
                height="24"
                icon={SETTINGS_ICON_SVG[setting]}
                classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500"
            />
            <Text type={TextType.p} secondary classes="group-hover:text-blue-500">
                {localize(`views.settings.${setting}.title`)}
            </Text>
        </button>
    {/each}
</div>

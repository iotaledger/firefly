<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        AdvancedSettings,
        AdvancedSettingsNoProfile,
        GeneralSettings,
        GeneralSettingsNoProfile,
        HelpAndInfo,
        SecuritySettings,
    } from '@core/router'
    import { Icon as IconEnum, SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
    import { Icon, Text, TextType } from 'shared/components'

    export let settings:
        | AdvancedSettings
        | AdvancedSettingsNoProfile
        | GeneralSettings
        | GeneralSettingsNoProfile
        | HelpAndInfo
        | SecuritySettings
    export let routes
    export let route

    export let onSettingClick: (..._: any[]) => void

    function changeRoute(setting) {
        document.getElementById('scroller').scrollTop = 0
        route = setting
    }
</script>

<div class="flex flex-col w-1/3 h-full justify-start items-start">
    {#each routes as setting}
        <div class="flex flex-col items-start">
            <button
                class="mb-2 pl-7 relative text-left flex flex-row items-center"
                on:click={() => changeRoute(setting)}
            >
                {#if route === setting}
                    <Icon
                        width="16"
                        height="16"
                        icon={IconEnum.SmallChevronRight}
                        classes="text-blue-500 absolute left-1 text-xl"
                    />
                {/if}
                <Text type={TextType.p}>{localize(`views.settings.${setting}.title`)}</Text>
            </button>
            {#if route === setting}
                {#each Object.values(settings[route]) as setting, i}
                    <button
                        on:click={() => onSettingClick(setting)}
                        class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-2 rounded-lg w-full ml-6 text-left {Object.values(
                            settings[route]
                        ).length -
                            1 ===
                            i && 'mb-4'}"
                    >
                        <Icon
                            width="24"
                            height="24"
                            icon={SETTINGS_ICON_SVG[setting]}
                            classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500"
                        />
                        <Text type={TextType.p} classes="group-hover:text-blue-500">
                            {localize(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            {/if}
        </div>
    {/each}
</div>

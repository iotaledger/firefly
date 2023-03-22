<script lang="ts" context="module">
    import {
        AdvancedSettingsRoute,
        AdvancedSettingsRouteNoProfile,
        GeneralSettingsRoute,
        GeneralSettingsRouteNoProfile,
        HelpAndInfoRoute,
        SecuritySettingsRoute,
    } from '@core/router'

    export namespace SettingsNavigatorTypes {
        export type Settings = {
            general: typeof GeneralSettingsRoute | typeof GeneralSettingsRouteNoProfile
            security?: typeof SecuritySettingsRoute
            advanced: typeof AdvancedSettingsRoute | typeof AdvancedSettingsRouteNoProfile
            helpAndInfo: typeof HelpAndInfoRoute
        }
    }
</script>

<script lang="ts">
    import { Icon, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'

    import { Icon as IconEnum, SETTINGS_ICON_SVG } from '@auxiliary/icon'

    export let settings: SettingsNavigatorTypes.Settings
    export let routes: string[]
    export let route: string
    export let onSettingClick: (..._: any[]) => void

    function changeRoute(setting: string): void {
        document.getElementById('scroller').scrollTop = 0
        route = setting
    }

    function getSettingRoutes(): string[] {
        return Object.values(settings[route])
    }
</script>

<settings-navigator class="flex flex-col w-1/3 h-full justify-start items-start">
    {#each routes as setting}
        <setting-container class="flex flex-col items-start">
            <button
                type="button"
                on:click={() => changeRoute(setting)}
                class="mb-2 pl-7 relative text-left flex flex-row items-center"
            >
                {#if route === setting}
                    <Icon
                        width="16"
                        height="16"
                        icon={IconEnum.SmallChevronRight}
                        classes="text-blue-500 absolute left-1 text-xl"
                    />
                {/if}
                <Text type={TextType.p}>
                    {localize(`views.settings.${setting}.title`)}
                </Text>
            </button>
            {#if route === setting}
                {@const settingRoutes = getSettingRoutes()}
                {#each settingRoutes as setting, i}
                    {@const isLast = settingRoutes.length - 1 === i}
                    <button
                        type="button"
                        on:click={() => onSettingClick(setting)}
                        class="group flex flex-row justify-start items-center hover:bg-blue-50
                        dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-2 rounded-lg w-full ml-6 text-left"
                        class:mb-4={isLast}
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
        </setting-container>
    {/each}
</settings-navigator>

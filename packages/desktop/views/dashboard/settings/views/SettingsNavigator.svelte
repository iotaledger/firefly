<script lang="ts">
    import { Icon as IconEnum, SETTINGS_ICON_SVG } from '@auxiliary/icon'
    import { ISetting, isSettingVisible } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { activeProfile, isActiveLedgerProfile } from '@core/profile'
    import { SettingsRoute, SettingsRouteNoProfile } from '@core/router'
    import features from '@features/features'
    import { FontWeight, Icon, Text, TextType } from '@ui'
    import { SETTINGS } from './settings.constant'

    export let currentCategory: string
    export let onSettingClick: (..._: any[]) => void

    const { loggedIn } = $activeProfile
    const categories = Object.values($loggedIn ? SettingsRoute : SettingsRouteNoProfile)

    function changeCategory(category: string): void {
        document.getElementById('scroller').scrollTop = 0
        currentCategory = category
    }

    function getSettingRoutes(): string[] {
        const visibleSettings =
            (SETTINGS?.[currentCategory] as ISetting[])?.filter((setting) =>
                isSettingVisible(
                    setting,
                    features?.settings?.[currentCategory]?.[setting.childRoute]?.enabled,
                    $loggedIn,
                    !$isActiveLedgerProfile,
                    $isActiveLedgerProfile
                )
            ) ?? []
        return visibleSettings.map((setting) => setting.childRoute)
    }
</script>

<settings-navigator class="flex flex-col w-1/3 h-full justify-start items-start">
    <Text type={TextType.h2} classes="mb-7">
        {localize('views.settings.settings')}
    </Text>
    {#each categories as category}
        <setting-container class="flex flex-col items-start">
            <button
                type="button"
                on:click={() => changeCategory(category)}
                class="mb-2 pl-7 relative text-left flex flex-row items-center"
            >
                {#if currentCategory === category}
                    <Icon
                        width="16"
                        height="16"
                        icon={IconEnum.SmallChevronRight}
                        classes="text-blue-500 absolute left-1 text-xl"
                    />
                {/if}
                <Text type={TextType.h5} fontWeight={FontWeight.medium}>
                    {localize(`views.settings.${category}.title`)}
                </Text>
            </button>
            {#if currentCategory === category}
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

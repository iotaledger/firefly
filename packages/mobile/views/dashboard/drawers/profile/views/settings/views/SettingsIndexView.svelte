<script lang="typescript">
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Icon, Text, TextType } from '@ui'
    import { SettingsCategory, SETTINGS_ROUTE_META } from '../../../../../../../lib/contexts/dashboard'
    import { SettingsRoute, settingsRouter } from '../../../../../../../lib/routers'

    const categories = {
        [SettingsCategory.General]: {
            name: localize('views.settings.general.title'),
            enabled: features.settings.general.enabled,
            settings: [],
        },
        [SettingsCategory.Security]: {
            name: localize('views.settings.security.title'),
            enabled: features.settings.security.enabled,
            settings: [],
        },
        [SettingsCategory.Advanced]: {
            name: localize('views.settings.advanced.title'),
            enabled: features.settings.advanced.enabled,
            settings: [],
        },
        [SettingsCategory.HelpAndInfo]: {
            name: localize('views.settings.helpAndInfo.title'),
            enabled: features.settings.helpAndInfo.enabled,
            settings: [],
        },
    }

    function handleSettingClick(route: SettingsRoute | string, external: boolean = false): void {
        if (external) {
            if (typeof route === 'string') {
                openUrlInBrowser(route)
            }
        } else {
            $settingsRouter.next({ goTo: route as SettingsRoute })
        }
    }

    for (const [route, setting] of Object.entries(SETTINGS_ROUTE_META)) {
        if (categories[setting.category].enabled) {
            const listItem = { ...setting, route }
            categories[setting.category].settings.push(listItem)
        }
    }
</script>

<div class="flex flex-col h-full justify-start items-start">
    {#each Object.values(categories) as category}
        {#if category.enabled}
            <Text type={TextType.h4} classes="mb-4">{category.name}</Text>
            <div class="flex flex-col space-y-1 w-full">
                {#each category.settings as setting}
                    {#if setting.enabled}
                        <button
                            class="p-2 w-full flex flex-row items-center space-x-4"
                            on:click={() =>
                                handleSettingClick(setting?.external ? setting?.url : setting.route, setting?.external)}
                        >
                            <Icon width="18" height="18" icon={setting.icon} classes="text-blue-500" />
                            <Text type={TextType.p} secondary>{localize(setting.name)}</Text>
                        </button>
                    {/if}
                {/each}
            </div>
        {/if}
    {/each}
</div>

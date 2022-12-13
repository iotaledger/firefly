<script lang="typescript">
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Icon, Text, TextType } from '@ui'
    import { SETTINGS, SettingsCategory } from '../../../../../../lib/contexts/dashboard'
    import { settingsRoute, SettingsRoute, settingsRouter } from '../../../../../../lib/routers'

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

    function handleSettingClick(route): void {
        $settingsRouter.goTo(route)
    }

    for (const [route, setting] of Object.entries(SETTINGS)) {
        if (categories[setting.category].enabled) {
            const listItem = { ...setting, route }
            categories[setting.category].settings.push(listItem)
        }
    }
</script>

{#if $settingsRoute === SettingsRoute.Init}
    <div class="flex flex-col h-full justify-start items-start">
        {#each Object.values(categories) as category}
            {#if category.enabled}
                <Text bold overrideColor classes="text-gray-700 mb-2">{category.name}</Text>
                {#each category.settings as setting}
                    {#if setting.enabled}
                        <button
                            class="py-1 pl-7 w-full relative text-left"
                            on:click={() => handleSettingClick(setting.route)}
                        >
                            <Icon
                                width="18"
                                height="18"
                                icon={setting.icon}
                                classes="text-blue-500 absolute left-1 top-0.4 text-xl"
                            />
                            <Text type={TextType.p} overrideColor classes="mb-1 text-gray-700"
                                >{localize(setting.name)}</Text
                            >
                        </button>
                    {/if}
                {/each}
            {/if}
        {/each}
    </div>
{:else}
    <svelte:component this={SETTINGS[$settingsRoute].view} />
{/if}

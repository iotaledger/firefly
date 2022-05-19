<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'

    export let settings
    export let routes
    export let route
    export let icons

    export let onSettingClick = (..._: any[]): void => {}

    function changeRoute(setting) {
        document.getElementById('scroller').scrollTop = 0
        route = setting
    }
</script>

<div class="flex flex-col w-1/3 h-full justify-start items-start">
    {#each routes as setting}
        <div class="flex flex-col items-start">
            <button class="mb-1 pl-7 relative text-left" on:click={() => changeRoute(setting)}>
                {#if route === setting}
                    <Icon
                        width="16"
                        height="16"
                        icon="small-chevron-right"
                        classes="text-blue-500 absolute left-1 top-0.4 text-xl"
                    />
                {/if}
                <Text type="p" classes="mb-1">{localize(`views.settings.${setting}.title`)}</Text>
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
                        <Icon icon={icons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" classes="group-hover:text-blue-500">
                            {localize(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            {/if}
        </div>
    {/each}
</div>

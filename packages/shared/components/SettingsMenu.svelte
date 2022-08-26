<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'

    export let settings
    export let activeSettings = []
    export let icons
    export let icon = undefined
    export let iconColor = undefined
    export let title
    export let description

    export let onClick = (..._: any[]): void => {}
</script>

<div class="flex-1 {$mobile && 'w-full'}">
    {#if !$mobile}
        <Icon boxed {icon} classes="text-white" boxClasses={`mb-5 ${iconColor}`} />
    {/if}
    <Text type="h4" classes="mb-2">{title}</Text>
    <Text type="p" classes="mb-4" secondary>{description}</Text>
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
                icon={icons[setting]}
                classes="{$mobile ? 'text-blue-500' : 'text-gray-500'} ml-1 mr-3 group-hover:text-blue-500"
            />
            <Text type="p" secondary classes="group-hover:text-blue-500">
                {localize(`views.settings.${setting}.title`)}
            </Text>
        </button>
    {/each}
</div>

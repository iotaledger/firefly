<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let settings
    export let activeSettings = []
    export let locale
    export let icons
    export let icon
    export let iconColor
    export let title
    export let description
    export let onClick = (setting) => {}
</script>

<div class="flex-1">
    <Icon boxed {icon} classes="text-white" boxClasses={`mb-5 ${iconColor}`} />
    <Text type="h4" classes="mb-2">{title}</Text>
    <Text type="p" classes="mb-4" secondary>{description}</Text>
    {#each Object.values(settings) as setting}
        <button
            on:click={() => onClick(setting)}
            class={`group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-3/4 text-left ${Object.values(activeSettings).includes(setting) ? '' : 'opacity-20 pointer-events-none'}`}
            disabled={!Object.values(activeSettings).includes(setting)}>
            <Icon icon={icons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text type="p" secondary classes="group-hover:text-blue-500">{locale(`views.settings.${setting}.title`)}</Text>
        </button>
    {/each}
</div>

<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let icon = 'shield'
    export let title = ''
    export let message = ''
    export let color = 'blue'
    export let classes = ''
    export let onClick = () => {}
</script>

<button
    on:click={() => onClick()}
    class="flex flex-col flex-wrap text-left rounded-xl px-3 py-3 bg-{color}-50 dark:bg-gray-900 dark:bg-opacity-50 {classes}">
    <Icon boxed {icon} classes="text-white" boxClasses="mb-2 bg-{color}-600" />
    <div>
        <Text>{title}</Text>
        <Text smaller overrideColor classes="text-{color}-500">{message}</Text>
    </div>
</button>

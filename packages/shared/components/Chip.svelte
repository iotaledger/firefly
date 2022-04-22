<script lang="typescript">
    import { Text } from 'shared/components'

    export let label: string = ''
</script>

<div class="bg-gray-500 dark:bg-gray-700 dark:bg-opacity-20 rounded-full px-2 py-1">
    <Text type="p" smaller classes="text-white uppercase">{label}</Text>
</div>

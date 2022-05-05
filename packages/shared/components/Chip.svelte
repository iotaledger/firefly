<script lang="typescript">
    import { Text } from 'shared/components'
    import { FontWeightText } from './Text.svelte'

    export let label: string = ''
</script>

<div class="bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20 rounded-full px-3 py-1">
    <Text type="p" smaller fontWeight={FontWeightText.semibold} color="gray-600" classes="uppercase">{label}</Text>
</div>

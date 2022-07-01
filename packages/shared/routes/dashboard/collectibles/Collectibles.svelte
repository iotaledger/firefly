<script lang="ts">
    import { TextType } from 'shared/components/Text.svelte'
    import { Pane, Text } from 'shared/components'
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-10 relative flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-1 gap-x-4 min-h-0">
        <Pane classes="p-6">
            <Text type={TextType.h3}>Collectibles</Text>
        </Pane>
    </div>
</div>

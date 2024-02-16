<script lang="ts">
    import { Text, Tooltip } from '@ui'
    import { TextType } from './enums'

    export let title: string = ''
    export let body: string = ''
</script>

<Tooltip {...$$restProps}>
    <div class="flex flex-col text-left space-y-2">
        {#if title}
            <Text type={TextType.h4}>
                {title}
            </Text>
        {/if}
        {#if body}
            <Text type={TextType.p}>
                {body}
            </Text>
        {/if}
    </div>
</Tooltip>

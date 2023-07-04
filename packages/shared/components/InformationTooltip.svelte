<script lang="ts">
    import { Text, Tooltip } from 'shared/components'
    import { Position, TextType } from './enums'

    export let anchor: HTMLElement
    export let position: Position = Position.Right
    export let title: string = ''
    export let body: string = ''
</script>

<Tooltip {anchor} {position} {...$$restProps}>
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

<script lang="ts">
    import { FontWeight, Text, Tooltip } from 'shared/components'
    import { Position } from './enums'

    export let anchor: HTMLElement
    export let position: Position = Position.Right
    export let title: string
    export let body: string
</script>

<Tooltip {anchor} {position}>
    <div class="flex flex-col text-left">
        <Text fontWeight={FontWeight.semibold} fontSize="16" classes="mb-2">
            {title}
        </Text>
        <Text fontWeight={FontWeight.normal}>
            {body}
        </Text>
    </div>
</Tooltip>

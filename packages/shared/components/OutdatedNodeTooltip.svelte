<script lang="ts">
    import { FontWeight, Text, TextType, Tooltip } from 'shared/components'
    import { Position } from './enums'
    import { localize } from '@core/i18n'

    export let anchor: HTMLElement
    export let position: Position = Position.Right
</script>

<Tooltip {anchor} {position}>
    <div class="flex flex-col text-left">
        <Text type={TextType.p} fontWeight={FontWeight.semibold} fontSize="16" classes="mb-2">
            {localize('tooltips.outdatedNode.title')}
        </Text>
        <Text type={TextType.p} fontWeight={FontWeight.normal}>
            {localize('tooltips.outdatedNode.body')}
        </Text>
    </div>
</Tooltip>

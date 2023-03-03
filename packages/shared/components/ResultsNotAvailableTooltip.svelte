<script lang="ts">
    import { FontWeight, Text, Tooltip } from 'shared/components'
    import { Position } from './enums'
    import { localize } from '@core/i18n'

    export let anchor: HTMLElement
    export let position: Position = Position.Right
</script>

<Tooltip {anchor} {position}>
    <div class="flex flex-col text-left">
        <Text fontWeight={FontWeight.semibold} fontSize="16" classes="mb-2">
            {localize('tooltips.governance.resultsNotAvailable.title')}
        </Text>
        <Text fontWeight={FontWeight.normal}>
            {localize('tooltips.governance.resultsNotAvailable.body')}
        </Text>
    </div>
</Tooltip>

<script lang="ts">
    import { Text, Tooltip, WarningBadge } from './'
    import { localize } from '@core/i18n'

    let strongholdTooltipAnchor = undefined
    let showStrongholdTooltip = false
    function toggleTooltip(): void {
        showStrongholdTooltip = !showStrongholdTooltip
    }
</script>

<stronghold-warning-badge
    bind:this={strongholdTooltipAnchor}
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}
>
    <WarningBadge />
</stronghold-warning-badge>

{#if showStrongholdTooltip}
    <Tooltip anchor={strongholdTooltipAnchor} position="right" size="small">
        <Text type="p">{localize('views.login.outdatedStronghold')}</Text>
    </Tooltip>
{/if}

<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Unit } from '@iota/unit-converter'
    import { Icon, Text } from 'shared/components'
    import GovernanceInfoTooltip from 'shared/components/GovernanceInfoTooltip.svelte'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccountStore } from 'shared/lib/wallet'

    const tooltip = { anchor: null as HTMLElement, show: false }

    function toggleTooltip(type: string, show: boolean): void {
        tooltip.show = show
    }

    let showPreciseStakedAmount = false
    function togglePreciseStakedAmount() {
        showPreciseStakedAmount = !showPreciseStakedAmount
    }
</script>

<div class="p-6 flex flex-col justify-between w-full h-full relative">
    <div class="flex flex-row justify-between items-start">
        <div class="flex items-center">
            <Text type="p" classes="mr-1">
                {localize('views.governance.votingPower.title')}
            </Text>
            <button
                on:mouseenter={() => toggleTooltip('votingWeight', true)}
                on:mouseleave={() => toggleTooltip('votingWeight', false)}
                bind:this={tooltip.anchor}
            >
                <Icon width="12" height="12" icon="info-filled" classes="text-gray-700 dark:text-gray-500" />
            </button>
        </div>
    </div>
    <div on:click={togglePreciseStakedAmount} class="mt-6">
        <h1 class="font-600 text-32 leading-120 text-gray-800 dark:text-white break-all">
            {showPreciseStakedAmount
                ? formatUnitPrecision($selectedAccountStore?.rawIotaBalance, Unit.Mi)
                : formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3)}
        </h1>
    </div>
</div>

{#if tooltip.show}
    <GovernanceInfoTooltip type="votingWeight" anchor={tooltip.anchor} position="bottom" />
{/if}

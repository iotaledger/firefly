<script lang="typescript">
    import { Text, Tooltip } from 'shared/components'
    import { Unit } from '@iota/unit-converter'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'

    export let color = 'blue' // TODO: profiles will have different colors

    export let balanceRaw
    export let balanceFiat

    let balanceBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    let showTooltip = false
    let showPreciseBalance = false

    function toggleTooltip() {
        showTooltip = !showTooltip
        parentWidth = balanceBox.offsetWidth / 2
        parentLeft = balanceBox.getBoundingClientRect().left
        parentTop = balanceBox.getBoundingClientRect().top
    }

    function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
        parentWidth = balanceBox.offsetWidth / 2
        parentLeft = balanceBox.getBoundingClientRect().left
        parentTop = balanceBox.getBoundingClientRect().top
    }
</script>

<div class="flex items-start flex-col flex-wrap space-y-1.5">
    <balance-box
        bind:this={balanceBox}
        on:mouseenter={toggleTooltip}
        on:mouseleave={toggleTooltip}
        on:click={togglePreciseBalance}>
        <Text type="h2" overrideColor classes="text-white">
            {showPreciseBalance ? formatUnitPrecision(balanceRaw, Unit.Mi) : formatUnitBestMatch(balanceRaw, true, 3)}
        </Text>
    </balance-box>
    <Text type="p" overrideColor smaller classes="text-{color}-200 dark:text-blue-300">{balanceFiat}</Text>
    {#if showTooltip}
        <Tooltip {parentTop} {parentLeft} {parentWidth}>
            <Text type="p">
                {!showPreciseBalance ? formatUnitPrecision(balanceRaw, Unit.Mi) : formatUnitBestMatch(balanceRaw, true, 3)}
            </Text>
        </Tooltip>
    {/if}
</div>

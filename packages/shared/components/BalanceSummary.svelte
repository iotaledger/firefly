<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text, Tooltip } from 'shared/components'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { tick } from 'svelte'

    export let color = 'blue' // TODO: profiles will have different colors

    export let balanceRaw
    export let balanceFiat

    let balanceBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    let showTooltip = false
    let showPreciseBalance = false

    $: balanceBox, showTooltip, showPreciseBalance, refreshParentBox()

    function toggleTooltip() {
        showTooltip = !showTooltip
    }

    async function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
    }

    async function refreshParentBox() {
        if (!balanceBox || !showTooltip) {
            return
        }
        await tick()
        parentWidth = balanceBox?.offsetWidth / 2 ?? 0
        parentLeft = balanceBox?.getBoundingClientRect().left ?? 0
        parentTop = balanceBox?.getBoundingClientRect().top ?? 0
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

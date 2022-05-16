<script lang="typescript">
    import { Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import { Unit } from '@iota/unit-converter'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'

    export let value = 0

    let showPreciseValue = false
    function togglePreciseValue() {
        showPreciseValue = !showPreciseValue
    }
</script>

{#if value}
    <button on:click={togglePreciseValue}>
        <Text type={TextType.h2}>
            {showPreciseValue ? formatUnitPrecision(value, Unit.i) : formatUnitBestMatch(value, true, 3)}
        </Text>
    </button>
{/if}

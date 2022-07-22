<script lang="typescript">
    import { Dropdown2 } from 'shared/components'
    import { ITokenMetadata } from '@core/wallet'
    import { Unit } from '@lib/units'
    import { Text } from 'shared/components'

    export let unit: string
    export let isFocused: boolean
    export let tokenMetadata: ITokenMetadata

    let previousTokenMetadata: ITokenMetadata = tokenMetadata

    $: if (!unit) unit = tokenMetadata?.unit
    $: if (tokenMetadata !== previousTokenMetadata) {
        unit = tokenMetadata?.unit
        previousTokenMetadata = tokenMetadata
    }

    let items = []
    $: if (!tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [{ label: tokenMetadata?.unit, value: tokenMetadata?.unit }]
        if (tokenMetadata.subunit) {
            items.push({ label: tokenMetadata?.subunit, value: tokenMetadata?.subunit })
        }
    } else if (tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [
            { label: tokenMetadata?.unit, value: tokenMetadata?.unit },
            { label: Unit.K + tokenMetadata?.unit, value: Unit.K + tokenMetadata?.unit },
            { label: Unit.M + tokenMetadata?.unit, value: Unit.M + tokenMetadata?.unit },
            { label: Unit.G + tokenMetadata?.unit, value: Unit.G + tokenMetadata?.unit },
            { label: Unit.T + tokenMetadata?.unit, value: Unit.T + tokenMetadata?.unit },
            { label: Unit.P + tokenMetadata?.unit, value: Unit.P + tokenMetadata?.unit },
        ]
    }

    function onSelect(selected) {
        unit = selected.value
    }
</script>

{#if items.length > 1}
    <Dropdown2 bind:isFocused value={unit} {items} {onSelect} contentWidth small />
{:else}
    <div class="block relative small">
        <div
            class="selection relative flex flex-row space-x-0 pl-1 pb-1.5 items-end w-full whitespace-nowrap bg-white dark:bg-gray-800 pr-0 border-transparent"
        >
            <Text fontSize="16" fontWeight="semibold" classes="text-gray-800 dark:text-white" smaller>
                {unit}
            </Text>
        </div>
    </div>
{/if}

<style type="text/scss">
    .selection {
        min-height: 36px;
        @apply border-solid;
        @apply border;
    }
</style>

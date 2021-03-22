<script lang="typescript">
    import { Icon, Tooltip, Text } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { truncateString } from 'shared/lib/helpers'
    import { formatUnit } from 'shared/lib/units'
    import { get } from 'svelte/store'

    export let locale
    export let address = ''
    export let balance = 0
    export let selected = false
    export let risk = undefined
    export let showRiskLevel = false
    export let disabled = false
    export let onClick = () => {}

    const RISK_COLORS = {
        0: 'green',
        1: 'blue',
        2: 'yellow',
        3: 'orange',
        4: 'red',
    }

    let showTooltip = false
    let errorBox
    let tooltipTop,
        tooltipLeft,
        iconWidth = 0

    let fiatBalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    $: errorMessage = disabled ? locale('views.secureSpentAddresses.error') : null

    function toggleShow() {
        showTooltip = !showTooltip
        iconWidth = errorBox.offsetWidth/2
        tooltipLeft = errorBox.getBoundingClientRect().left
        tooltipTop = errorBox.getBoundingClientRect().top
    }
</script>

<style type="text/scss">
    button {
        &:not(:disabled):hover,
        &:not(:disabled):focus-within {
            .radio-button {
                @apply border-blue-500;
            }
        }
        &:disabled {
            @apply cursor-default;
        }
        .radio-button {
            :global(svg path) {
                @apply text-white;
                @apply stroke-current;
                fill: none;
            }
            &.active {
                @apply border-0;
                @apply bg-blue-500;
            }
        }
    }
</style>

<button
    class="w-full static p-4 flex justify-between items-center border-solid border border-gray-200 rounded-2xl"
    class:selected
    {disabled}
    on:click={onClick}>
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-4 text-left">
            <div class="radio-button w-6 h-6 mr-3 rounded-full border border-solid border-gray-300" class:active={selected}>
                <Icon icon={!disabled || selected ? 'radio' : 'radio-unchecked'} />
            </div>
            <div>
                <Text type="pre" secondary={disabled} smaller>{truncateString(address, 9, 9)}</Text>
                <Text type="p" secondary smaller>{formatUnit(balance)} · <span class="uppercase">{fiatBalance}</span></Text>
            </div>
        </div>
        {#if showRiskLevel}
            <risk-meter class="flex flex-row space-x-0.5">
                {#each Array(Object.keys(RISK_COLORS).length) as _, i}
                    <span class="h-4 w-1 rounded-2xl {i <= risk ? `bg-${RISK_COLORS?.[risk]}-500` : 'bg-gray-300'}" />
                {/each}
            </risk-meter>
        {:else if disabled}
            <div class="flex items-center static" on:mouseenter={toggleShow} on:mouseleave={toggleShow} bind:this={errorBox}>
                <Icon icon="info" classes="text-red-500 bg-white rounded-full dark:bg-gray-800" />
                {#if showTooltip && errorMessage}
                    <Tooltip topOffset={tooltipTop} leftOffset={tooltipLeft} elementWidth={iconWidth}>
                        <Text>{errorMessage}</Text>
                    </Tooltip>
                {/if}
            </div>
        {/if}
    </div>
</button>

<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
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
        0: 'blue',
        1: 'green',
        2: 'yellow',
        3: 'orange',
        4: 'red',
    }

    let showTooltip = false
    let errorBox
    let parentTop,
        parentLeft,
        parentWidth = 0

    let fiatBalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    $: errorMessage = disabled ? locale('views.secureSpentAddresses.error') : null

    function toggleTooltip() {
        showTooltip = !showTooltip
        parentWidth = errorBox.offsetWidth / 2
        parentLeft = errorBox.getBoundingClientRect().left
        parentTop = errorBox.getBoundingClientRect().top
    }

    function getRiskColor(_risk) {
        // Very high risk: score  > 10^-13      
        // high risk: 10^-13 > score > 10^-15
        // medium risk: 10^-15 > score > 10^-17
        // low risk: 10^-17 > score > 10^-19
        // very low risk: score < 10^-19
        if (_risk < 10 ** -19) {
            return 'green'
        } else if (_risk > 10 ** -19 && _risk < 10 ** -17) {
            return 'blue'
        } else if (_risk > 10 ** -17 && _risk < 10 ** -15) {
            return 'yellow'
        } else if (_risk > 10 ** -15 && _risk < 10 ** -13) {
            return 'orange'
        } else if (_risk > 10 ** -13) {
            return 'red'
        }
    }
</script>

<style type="text/scss">
    button {
        &:not(:disabled):hover {
            .radio-button {
                @apply border-blue-500;
            }
        }
        &:disabled {
            @apply cursor-not-allowed;
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
    class="w-full static p-4 flex justify-between items-center border-solid border border-gray-300 dark:border-gray-700
    rounded-2xl"
    class:selected
    {disabled}
    on:click={onClick}>
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-4 text-left">
            <div
                class="radio-button w-6 h-6 mr-3 rounded-full border border-solid border-gray-300 dark:border-gray-700"
                class:active={selected}>
                <Icon icon={!disabled && selected ? 'radio' : 'radio-unchecked'} />
            </div>
            <div>
                <Text type="pre" secondary={disabled} smaller classes={disabled && 'line-through'}>
                    {truncateString(address, 9, 9)}
                </Text>
                <Text type="p" secondary smaller>
                    {formatUnit(balance)} ·
                    <span class="uppercase">{fiatBalance}</span>
                </Text>
            </div>
        </div>
        {#if showRiskLevel}
            <risk-meter class="flex flex-row space-x-0.5">
                {#each Array(Object.keys(RISK_COLORS).length) as _, i}
                    <span
                        class="h-4 w-1 rounded-2xl {i <= risk ? `bg-${getRiskColor(risk)}-500` : 'bg-gray-300 dark:bg-gray-700'}" />
                {/each}
            </risk-meter>
        {:else if disabled}
            <div
                class="flex items-center static"
                on:mouseenter={toggleTooltip}
                on:mouseleave={toggleTooltip}
                bind:this={errorBox}>
                <Icon icon="exclamation" classes="text-red-500 bg-white rounded-full dark:bg-gray-800" />
                {#if showTooltip && errorMessage}
                    <Tooltip {parentTop} {parentLeft} {parentWidth}>
                        <Text>{errorMessage}</Text>
                    </Tooltip>
                {/if}
            </div>
        {/if}
    </div>
</button>

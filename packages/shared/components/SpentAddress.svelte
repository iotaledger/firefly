<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import { truncateString } from 'shared/lib/helpers'
    import { RiskLevel } from 'shared/lib/typings/migration'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let address = ''
    export let balance = 0
    export let selected = false
    export let risk = undefined
    export let showRiskLevel = false
    export let onClick = () => {}

    let showErrorTooltip = false
    let showRiskTooltip = false
    let errorBox
    let riskBox
    let parentTop,
        parentLeft,
        parentWidth = 0

    enum TooltipType {
        Risk,
        Error,
    }

    let riskColor = 'gray'
    let localeRiskLevel = ''
    let riskBars = 0

    let fiatBalance = formatCurrency(
        convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[AvailableExchangeRates.USD]),
        AvailableExchangeRates.USD
    )

    function toggleTooltip(type: TooltipType) {
        if (risk) {
            if (type === TooltipType.Risk) {
                showRiskTooltip = !showRiskTooltip
                parentWidth = riskBox.offsetWidth / 2
                parentLeft = riskBox.getBoundingClientRect().left
                parentTop = riskBox.getBoundingClientRect().top
            } else if (type === TooltipType.Error) {
                showErrorTooltip = !showErrorTooltip
                parentWidth = errorBox.offsetWidth / 2
                parentLeft = errorBox.getBoundingClientRect().left
                parentTop = errorBox.getBoundingClientRect().top
            }
        }
    }

    onMount(() => {
        if (risk < RiskLevel.LOW) {
            riskColor = 'green'
            localeRiskLevel = 'veryLow'
            riskBars = 1
        } else if (risk >= RiskLevel.LOW && risk < RiskLevel.MEDIUM) {
            riskColor = 'blue'
            localeRiskLevel = 'low'
            riskBars = 2
        } else if (risk >= RiskLevel.MEDIUM && risk < RiskLevel.HIGH) {
            riskColor = 'yellow'
            localeRiskLevel = 'medium'
            riskBars = 3
        } else if (risk >= RiskLevel.HIGH && risk < RiskLevel.VERYHIGH) {
            riskColor = 'orange'
            localeRiskLevel = 'high'
            riskBars = 4
        } else if (risk >= RiskLevel.VERYHIGH) {
            riskColor = 'red'
            localeRiskLevel = 'veryHigh'
            riskBars = 5
        }
    })
</script>

<button
    class="w-full static p-4 flex justify-between items-center border-solid border border-gray-300 dark:border-gray-700
    rounded-2xl"
    class:selected
    on:click={onClick}
>
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-4 text-left">
            <div
                class="radio-button w-6 h-6 mr-3 rounded-full border border-solid border-gray-300 dark:border-gray-700"
                class:active={selected}
            >
                <Icon icon={selected ? 'radio' : 'radio-unchecked'} />
            </div>
            <div>
                <Text type="pre" smaller>{truncateString(address, 9, 9)}</Text>
                <Text type="p" secondary smaller>
                    {formatUnitBestMatch(balance, true, 3)}
                    ·
                    <span class="uppercase">{fiatBalance}</span>
                </Text>
            </div>
        </div>
        {#if showRiskLevel}
            <risk-meter
                bind:this={riskBox}
                on:mouseenter={() => toggleTooltip(TooltipType.Risk)}
                on:mouseleave={() => toggleTooltip(TooltipType.Risk)}
                class="flex flex-row items-center space-x-0.5"
            >
                <Icon icon="info" classes="mr-1 text-gray-800 dark:text-white" width={20} height={20} />
                {#each Array(Object.keys(RiskLevel).length / 2) as _, i}
                    <span
                        class="h-4 w-1 rounded-2xl {i <= riskBars - 1
                            ? `bg-${riskColor}-500`
                            : 'bg-gray-300 dark:bg-gray-700'}"
                    />
                {/each}
            </risk-meter>
            {#if showRiskTooltip && risk}
                <Tooltip {parentTop} {parentLeft} {parentWidth}>
                    <Text
                        >{locale('tooltips.risk.title', {
                            values: { risk: locale(`tooltips.risk.${localeRiskLevel}`) },
                        })}</Text
                    >
                </Tooltip>
            {/if}
        {/if}
    </div>
</button>

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

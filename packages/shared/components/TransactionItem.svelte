<script lang="typescript">
    import { Icon, Tooltip } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { get } from 'svelte/store'
    import Text from './Text.svelte'
    import { Locale } from '@core/i18n'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'

    enum Status {
        ReadyToMigrate = 0,
        Migrating = 1,
        Success = 2,
        Error = -1,
    }

    export let locale: Locale

    export let name = ''
    export let balance = 0
    export let status = Status.ReadyToMigrate
    export let errorText = null

    const fiatBalance = formatCurrency(
        convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[AvailableExchangeRates.USD]),
        AvailableExchangeRates.USD
    )

    const balanceString = `${formatUnitBestMatch(balance, true, 3)} • ${fiatBalance}`

    let showTooltip = false
    let tooltipAnchor

    function toggleShow() {
        showTooltip = !showTooltip
    }
</script>

<div
    class="transaction-item relative flex justify-between border-solid border border-gray-200 dark:border-gray-700 rounded-2xl h-14 items-center pl-5 pr-6 focus:border-blue-500 mt-4"
>
    <div class="flex items-center justify-between w-full space-x-4">
        <div class="flex items-center">
            <Icon icon="transfer" classes="text-blue-500" />
            <Text type="p" smaller classes="ml-4 whitespace-nowrap">{name}</Text>
        </div>
        <div class="flex items-center relative text-right">
            {#if status === Status.ReadyToMigrate}
                <Text type="p" secondary smaller classes="uppercase">{balanceString}</Text>
            {:else if status === Status.Migrating}
                <Text type="p" secondary smaller>{locale('views.migrate.migrating')}</Text>
            {:else if status === Status.Success}
                <Text type="p" secondary smaller
                    >{locale('views.migrate.migrated', { values: { balance: balanceString } })}</Text
                >
                <Icon icon="status-success" classes="text-white bg-green-600 rounded-full ml-3" />
            {:else if status === -1}
                <div class="flex items-center relative">
                    <Text type="p" secondary smaller classes="mr-3">{locale('views.migrate.migrationFailed')}</Text>
                    <div
                        class="relative"
                        on:mouseenter={toggleShow}
                        on:mouseleave={toggleShow}
                        bind:this={tooltipAnchor}
                    >
                        <Icon icon="status-error" classes="text-white bg-red-500 rounded-full " />
                    </div>
                    {#if showTooltip && errorText}
                        <Tooltip anchor={tooltipAnchor}>
                            <Text>{errorText}</Text>
                        </Tooltip>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

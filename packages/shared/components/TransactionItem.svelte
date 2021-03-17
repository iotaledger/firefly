<script lang="typescript">
    import { Icon, Tooltip } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { get } from 'svelte/store'
    import Text from './Text.svelte'

    enum Status {
        ReadyToMigrate = 0,
        Migrating = 1,
        Success = 2,
        Error = -1,
    }

    export let locale
    export let name = ''
    export let balance = 0
    export let status = Status.ReadyToMigrate
    export let errorText = null

    let fiatBalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    let showTooltip = false

    function toggleShow() {
        showTooltip = !showTooltip
    }
</script>

<div
    class="transaction-item relative flex justify-between border-solid border border-gray-200 rounded-2xl h-14 items-center pl-5 pr-6 focus:border-blue-500 mt-4">
    <div class="flex items-center justify-between w-full space-x-4">
        <div class="flex items-center">
            <Icon icon="double-chevron-right" classes="right text-blue-500" />
            <Text type="p" smaller classes="ml-4 whitespace-nowrap">{name}</Text>
        </div>
        <div class="flex items-center relative text-right">
            {#if status === Status.ReadyToMigrate}
                <Text type="p" secondary smaller classes="uppercase">{fiatBalance}</Text>
            {:else if status === Status.Migrating}
                <Text type="p" secondary smaller>{locale('views.migrate.migrating')}</Text>
            {:else if status === Status.Success}
                <Text type="p" secondary smaller>
                    {locale('views.migrate.migrated', { values: { balance: fiatBalance.toUpperCase() } })}
                </Text>
                <Icon icon="status-success" classes="text-white bg-green-600 rounded-full ml-3" />
            {:else if status === -1}
                <div class="flex items-center relative" on:mouseenter={toggleShow} on:mouseleave={toggleShow}>
                    <Text type="p" secondary smaller>{locale('views.migrate.migrationFailed')}</Text>
                    <div class="relative">
                        <Icon icon="status-error" classes="text-white bg-red-500 rounded-full ml-3" />
                        {#if showTooltip && errorText}
                            <Tooltip>
                                <Text>{errorText}</Text>
                            </Tooltip>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

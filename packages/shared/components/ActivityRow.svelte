<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    import type { Payload } from 'shared/lib/typings/message'
    import { formatUnit } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import type { Writable } from 'svelte/store'

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    export let id
    export let timestamp
    export let confirmed
    export let color
    export let payload: Payload
    export let locale

    export let balance // migration tx

    let cachedMigrationTx = !payload
    let milestoneMessage = payload?.type === 'Milestone'

    const getMessageValue = () => {
        if (cachedMigrationTx) {
            return formatUnit(balance)
        }

        if (milestoneMessage) {
            const funds = payload.data.essence.receipt.data.funds

            const firstAccount = $accounts.find((acc) => acc.index === 0)
            const firstAccountAddresses = firstAccount.addresses.map((address) => address.address)

            const totalValue = funds
                .filter((fund) => firstAccountAddresses.includes(fund.output.address))
                .reduce((acc, fund) => acc + fund.output.amount, 0)

            return formatUnit(totalValue)
        }
        return `${!payload.data.essence.data.incoming ? '-' : ''}${formatUnit(payload.data.essence.data.value)}`
    }

    export let onClick = () => {}
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4 {(!confirmed || cachedMigrationTx) && 'opacity-50'} {cachedMigrationTx && 'pointer-events-none'}"
    disabled={cachedMigrationTx}>
    {#if cachedMigrationTx || milestoneMessage}
        <Icon boxed classes="text-white" boxClasses="bg-gray-500 dark:bg-gray-900" icon="double-chevron-right" />
    {:else}
        <Icon
            boxed
            classes="text-white dark:text-{payload.data.essence.data.internal ? 'gray-500' : `${color}-${payload.data.essence.data.incoming ? '500' : '600'}`}"
            boxClasses="bg-{payload.data.essence.data.internal ? 'gray-500' : `${color}-${payload.data.essence.data.internal ? '500' : '600'}`} dark:bg-gray-900"
            icon={payload.data.essence.data.internal ? 'transfer' : payload.data.essence.data.incoming ? 'chevron-down' : 'chevron-up'} />
    {/if}
    <div class="flex flex-col ml-3.5 space-y-1.5">
        <Text type="p" bold smaller>{true || milestoneMessage ? locale('general.fundMigration') : truncateString(id)}</Text>
        <p class="text-10 leading-120 text-gray-500">
            {$date(new Date(timestamp), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            })}
        </p>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller>{getMessageValue()}</Text>
    </div>
</button>

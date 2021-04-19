<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { formatDate } from 'shared/lib/i18n'
    import type { Milestone, Payload, Transaction } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/wallet'
    import {
        getMilestoneMessageValue,
        receiverAddressesFromTransactionPayload,
        sendAddressFromTransactionPayload,
    } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'

    export let timestamp
    export let confirmed
    export let color
    export let locale
    export let includeFullSender
    export let payload: Payload

    export let balance // migration tx

    let messageValue = ''

    $: cachedMigrationTx = !payload
    $: milestonePayload = payload?.type === 'Milestone' ? (payload as Milestone) : undefined
    $: txPayload = payload?.type === 'Transaction' ? (payload as Transaction) : undefined
    $: cachedMigrationTx, milestonePayload, txPayload, (messageValue = getMessageValue())

    const getMessageValue = () => {
        if (cachedMigrationTx) {
            return formatUnitBestMatch(balance, true, 2)
        }
        if (milestonePayload) {
            return formatUnitBestMatch(getMilestoneMessageValue(milestonePayload, $accounts), true, 2)
        }
        return `${!txPayload.data.essence.data.incoming ? '-' : ''}${formatUnitBestMatch(
            txPayload.data.essence.data.value,
            true,
            2
        )}`
    }

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    $: senderAddress = sendAddressFromTransactionPayload(payload)
    $: receiverAddresses = receiverAddressesFromTransactionPayload(payload)

    $: senderAccount = senderAddress
        ? $accounts?.find((acc) => acc.addresses.some((add) => senderAddress === add.address)) ?? null
        : null

    $: receiverAccount = receiverAddresses?.length
        ? $accounts.find((acc) => acc.addresses.some((add) => receiverAddresses.includes(add.address))) ?? null
        : null

    let initialsColor
    let accountAlias = ''

    $: {
        if (txPayload) {
            const acc = txPayload.data.essence.data.incoming ? receiverAccount : senderAccount

            if (acc) {
                if (includeFullSender) {
                    accountAlias = acc.alias
                }
                if (txPayload.data.essence.data.internal) {
                    initialsColor = acc.color
                }
            }
        }
    }

    let direction
    $: {
        if (txPayload) {
            if (includeFullSender) {
                direction = confirmed
                    ? txPayload.data.essence.data.incoming
                        ? 'general.receivedTo'
                        : 'general.sentFrom'
                    : txPayload.data.essence.data.incoming
                    ? 'general.receivingTo'
                    : 'general.sendingFrom'
            } else {
                direction = confirmed
                    ? txPayload.data.essence.data.incoming
                        ? 'general.received'
                        : 'general.sent'
                    : txPayload.data.essence.data.incoming
                    ? 'general.receiving'
                    : 'general.sending'
            }
        }
    }

    export let onClick = () => {}
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4 {(!confirmed || cachedMigrationTx) && 'opacity-50'} {cachedMigrationTx && 'pointer-events-none'} overflow-hidden"
    disabled={cachedMigrationTx}>
    <div class="w-8">
        {#if cachedMigrationTx || milestonePayload}
            <Icon boxed classes="text-white" boxClasses="bg-gray-500 dark:bg-gray-900" icon="double-chevron-right" />
        {:else}
            <Icon
                boxed
                classes="text-white dark:text-{txPayload.data.essence.data.internal ? 'gray-500' : `${color}-${txPayload.data.essence.data.incoming ? '500' : '600'}`}"
                boxClasses="bg-{initialsColor ? `${initialsColor}-500` : txPayload.data.essence.data.internal ? 'gray-500' : `${color}-${txPayload.data.essence.data.internal ? '500' : '600'}`} dark:bg-gray-900"
                icon={txPayload.data.essence.data.internal ? 'transfer' : txPayload.data.essence.data.incoming ? 'chevron-down' : 'chevron-up'} />
        {/if}
    </div>
    <div class="flex flex-col ml-3.5 space-y-1.5 overflow-hidden">
        <Text type="p" bold smaller classes="overflow-hidden overflow-ellipsis multiwrap-line2">
            {cachedMigrationTx || milestonePayload ? locale('general.fundMigration') : locale(direction, {
                      values: { account: accountAlias },
                  })}
        </Text>
        <p class="text-10 leading-120 text-gray-500">
            {formatDate(new Date(timestamp), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })}
        </p>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller classes="whitespace-nowrap">{messageValue}</Text>
    </div>
</button>

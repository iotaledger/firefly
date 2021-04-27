<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    import { formatDate } from 'shared/lib/i18n'
    import type { Milestone, Payload, Transaction } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        findAccountWithAddress,
        findAccountWithAnyAddress,
        getIncomingFlag,
        getInternalFlag,
        getMilestoneMessageValue,
        receiverAddressesFromTransactionPayload,
        sendAddressFromTransactionPayload,
        WalletAccount,
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
            return formatUnitBestMatch(balance, true, 3)
        }
        if (milestonePayload) {
            return formatUnitBestMatch(getMilestoneMessageValue(milestonePayload, $accounts), true, 3)
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

    // There can only be one sender address which either belongs to us or not
    $: senderAccount = findAccountWithAddress(senderAddress)

    // For an incoming transaction there might be multiple receiver addresses
    // especially if there was a remainder, so if any account addresses match
    // we need to find the account details for our address match
    $: receiverAccount =
        getIncomingFlag(txPayload) || getInternalFlag(txPayload) ? findAccountWithAnyAddress(receiverAddresses, senderAccount) : null

    let initialsColor
    let accountAlias = ''

    $: {
        if (txPayload) {
            const acc = txPayload.data.essence.data.incoming ? receiverAccount : senderAccount

            // The address in the payload was one of our accounts so grab
            // the account alias to display
            if (acc) {
                if (includeFullSender) {
                    accountAlias = acc.alias
                }
                initialsColor = acc.color
            } else {
                // We can't find the address in our accounts so just display the abbreviated address
                if (includeFullSender) {
                    accountAlias = truncateString(
                        txPayload.data.essence.data.incoming ? receiverAddresses[0] : senderAddress,
                        3,
                        3
                    )
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
                classes={`text-white dark:text-${initialsColor}-600`}
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

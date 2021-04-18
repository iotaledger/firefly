<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { receiverAddressesFromPayload, sendAddressFromPayload } from 'shared/lib/helpers'
    import { formatDate } from 'shared/lib/i18n'
    import type { Payload } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'

    export let timestamp
    export let confirmed
    export let color
    export let locale
    export let includeFullSender

    export let payload: Payload

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    $: senderAddress = sendAddressFromPayload(payload)
    $: receiverAddresses = receiverAddressesFromPayload(payload)

    $: senderAccount = senderAddress
        ? $accounts?.find((acc) => acc.addresses.some((add) => senderAddress === add.address)) ?? null
        : null

    $: receiverAccount = receiverAddresses?.length
        ? $accounts.find((acc) => acc.addresses.some((add) => receiverAddresses.includes(add.address))) ?? null
        : null

    let initialsColor
    let accountAlias = ''

    $: {
        const acc = payload.data.essence.data.incoming ? receiverAccount : senderAccount

        if (acc) {
            if (includeFullSender) {
                accountAlias = acc.alias
            }
            if (payload.data.essence.data.internal) {
                initialsColor = acc.color
            }
        }
    }

    let direction
    $: {
        if (includeFullSender) {
            direction = confirmed
                ? payload.data.essence.data.incoming
                    ? 'general.receivedTo'
                    : 'general.sentFrom'
                : payload.data.essence.data.incoming
                ? 'general.receivingTo'
                : 'general.sendingFrom'
        } else {
            direction = confirmed
                ? payload.data.essence.data.incoming
                    ? 'general.received'
                    : 'general.sent'
                : payload.data.essence.data.incoming
                ? 'general.receiving'
                : 'general.sending'
        }
    }

    export let onClick = () => {}
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4 {!confirmed ? 'opacity-50' : ''}">
    <div class="w-8">
        <Icon
            boxed
            classes="text-white dark:text-{payload.data.essence.data.internal ? 'gray-500' : `${color}-${payload.data.essence.data.incoming ? '500' : '600'}`}"
            boxClasses="bg-{initialsColor ? `${initialsColor}-500` : payload.data.essence.data.internal ? 'gray-500' : `${color}-${payload.data.essence.data.internal ? '500' : '600'}`} dark:bg-gray-900"
            icon={payload.data.essence.data.internal ? 'transfer' : payload.data.essence.data.incoming ? 'chevron-down' : 'chevron-up'} />
    </div>
    <div class="flex flex-col ml-3.5 space-y-1.5">
        <Text type="p" bold smaller>{locale(direction, { values: { account: accountAlias } })}</Text>
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
        <Text type="p" smaller>
            {`${!payload.data.essence.data.incoming ? '-' : ''}${formatUnitBestMatch(payload.data.essence.data.value)}`}
        </Text>
    </div>
</button>

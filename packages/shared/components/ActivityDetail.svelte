<script lang="typescript">
    import { getContext } from 'svelte'
    import { Icon, Text } from 'shared/components'
    import { getInitials, truncateString } from 'shared/lib/helpers'
    import { formatUnit } from 'shared/lib/units'
    import type { Account } from 'shared/lib/typings/account'
    import type { Writable } from 'svelte/store'

    export let account
    export let id
    export let incoming
    export let value
    export let payload
    export let timestamp
    export let color = 'blue'
    export let locale
    export let onBackClick = () => {}

    const accounts = getContext<Writable<Account[]>>('walletAccounts')

    const reference: string = 'Lorem ipsum' // TODO
    const inputAddress: string = 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98' // TODO
    const receivers: [{ address?: string }] = // TODO: if internal && !incoming, find to which account the address/es belong to
        payload?.data?.essence?.data?.outputs
            ?.filter((output) => output?.data?.remainder === false)
            ?.map((output) => output.data) ?? []
    $: accountAlias = $accounts.find((acc) => acc.index === account)?.alias
</script>

<div class="flex flex-col h-full min-h-0">
    <div
        class="px-4 pt-7 pb-3.5 mb-5 rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50">
        <div>
            {#if !incoming}
                <div class="w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-140 font-bold text-center bg-{color}-500 text-white">
                    {getInitials(accountAlias, 2)}
                </div>
            {/if}
            <Text smaller>{incoming ? truncateString(inputAddress, 3, 3, 3) : locale('general.you')}</Text>
        </div>
        <Icon icon="arrow-small-right" classes="mx-4 text-gray-500 dark:text-white" />
        <Text bold smaller>{formatUnit(value)}</Text>
        <Icon icon="arrow-small-right" classes="mx-4 text-gray-500 dark:text-white" />
        <div class="flex flex-col flex-wrap justify-center text-center">
            {#if incoming}
                <div class="w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-140 font-bold bg-{color}-500 text-white">
                    {getInitials(accountAlias, 2)}
                </div>
            {/if}
            {#if incoming}
                <Text smaller>{locale('general.you')}</Text>
            {:else}
                {#each receivers as receiver}
                    <Text smaller>{truncateString(receiver.address, 3, 3, 3)}</Text>
                {/each}
            {/if}
        </div>
    </div>
    <div class="mb-6 h-full overflow-y-auto">
        {#if timestamp}
            <div class="mb-5">
                <Text secondary>{locale('general.date')}</Text>
                <Text smaller>
                    {new Date(timestamp).toLocaleString('default', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    })}
                </Text>
            </div>
        {/if}
        {#if reference}
            <div class="mb-5">
                <Text secondary>{locale('general.reference')}</Text>
                <Text smaller>{reference}</Text>
            </div>
        {/if}
        {#if id}
            <div class="mb-5">
                <Text secondary>{locale('general.transaction_id')}</Text>
                <Text type="pre">{id}</Text>
            </div>
        {/if}
        {#if inputAddress}
            <div class="mb-5">
                <Text secondary>{locale('general.input_address')}</Text>
                <Text type="pre">{inputAddress}</Text>
            </div>
        {/if}
        {#if receivers.length > 0}
            <div class="mb-5">
                <Text secondary>{locale('general.receive_address')}</Text>
                {#each receivers as receiver}
                    <Text type="pre" classes="mb-2">{receiver.address}</Text>
                {/each}
            </div>
        {/if}
    </div>

    <div class="w-full flex justify-center">
        <button on:click={onBackClick}><Text smaller highlighted>{locale('actions.hide_details')}</Text></button>
    </div>
</div>

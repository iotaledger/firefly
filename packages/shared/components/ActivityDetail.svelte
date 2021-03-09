<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { getInitials, truncateString } from 'shared/lib/helpers'
    import { formatUnit } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import type { Readable, Writable } from 'svelte/store'

    export let id
    export let incoming
    export let internal
    export let value
    export let payload
    export let timestamp
    export let locale
    export let onBackClick = () => {}

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const activeAccount = getContext<Readable<WalletAccount>>('selectedAccount')

    let senderAccount: WalletAccount
    let receiverAccount: WalletAccount

    let senderAddress: string =
        payload?.data?.essence?.data?.inputs?.find((input) => input?.type === 'UTXO')?.data?.metadata?.address ?? null

    let receiverAddresses: string[] =
        payload?.data?.essence?.data?.outputs
            ?.filter((output) => output?.data?.remainder === false)
            ?.map((output) => output?.data?.address) ?? []

    $: senderAccount = !incoming
        ? $activeAccount
        : internal
        ? $accounts.find((acc) => acc.addresses.some((add) => senderAddress === add.address))
        : null

    $: receiverAccount = incoming
        ? $activeAccount
        : internal
        ? $accounts.find((acc) => acc.addresses.some((add) => receiverAddresses.includes(add.address)))
        : null
</script>

<div class="flex flex-col h-full min-h-0">
    <div
        class="px-4 pt-7 pb-3.5 mb-5 rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50">
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if senderAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold text-center bg-{senderAccount?.color ?? 'blue'}-500 text-white">
                    {getInitials(senderAccount.alias, 2)}
                </div>
                {#if !incoming}
                    <Text smaller>{locale('general.you')}</Text>
                {/if}
            {:else}
                <Text smaller>{truncateString(senderAddress, 3, 3, 3)}</Text>
            {/if}
        </div>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <Text bold smaller>{formatUnit(value)}</Text>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if receiverAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold bg-{receiverAccount?.color ?? 'blue'}-500 text-white">
                    {getInitials(receiverAccount.alias, 2)}
                </div>
                {#if incoming}
                    <Text smaller>{locale('general.you')}</Text>
                {/if}
            {/if}
            {#if !incoming}
                {#each receiverAddresses as address}
                    <Text smaller>{truncateString(address, 3, 3, 3)}</Text>
                {/each}
            {/if}
        </div>
    </div>
    <div class="mb-6 h-full overflow-y-auto">
        {#if timestamp}
            <div class="mb-5">
                <Text secondary>{locale('general.date')}</Text>
                <Text smaller>
                    {$date(new Date(timestamp), {
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
        {#if id}
            <div class="mb-5">
                <Text secondary>{locale('general.transaction_id')}</Text>
                <Text type="pre">{id}</Text>
            </div>
        {/if}
        {#if senderAddress}
            <div class="mb-5">
                <Text secondary>{locale('general.input_address')}</Text>
                <Text type="pre">{senderAddress}</Text>
            </div>
        {/if}
        {#if receiverAddresses.length > 0}
            <div class="mb-5">
                <Text secondary>{locale('general.receive_address')}</Text>
                {#each receiverAddresses as receiver}
                    <Text type="pre" classes="mb-2">{receiver}</Text>
                {/each}
            </div>
        {/if}
    </div>

    <div class="w-full flex justify-center">
        <button on:click={onBackClick}><Text smaller highlighted>{locale('actions.hide_details')}</Text></button>
    </div>
</div>

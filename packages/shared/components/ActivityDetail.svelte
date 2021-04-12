<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { getInitials, truncateString } from 'shared/lib/helpers'
    import { formatUnit } from 'shared/lib/units'
    import { setClipboard } from 'shared/lib/utils'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import type { Readable, Writable } from 'svelte/store'
    import type { Payload } from 'shared/lib/typings/message'

    export let id
    export let timestamp
    export let confirmed
    export let locale
    export let payload: Payload
    export let onBackClick = () => {}

    const accounts = getContext<Writable<WalletAccount[]>>('viewableAccounts')
    const activeAccount = getContext<Readable<WalletAccount>>('selectedAccount')

    let senderAccount: WalletAccount
    let receiverAccount: WalletAccount

    const prepareSenderAddress = () => {
        if (payload.type === 'Transaction') {
            return payload?.data?.essence?.data?.inputs?.find((input) => input?.type === 'UTXO')?.data?.metadata?.address ?? null
        } else if (payload.type === 'Milestone') {
            return 'Legacy Network'
        }

        return null
    }

    const prepareReceiverAddress = () => {
        if (payload.type === 'Transaction') {
            return (
                payload?.data?.essence?.data?.outputs
                    ?.filter((output) => output?.data?.remainder === false)
                    ?.map((output) => output?.data?.address) ?? []
            )
        } else if (payload.type === 'Milestone') {
            const funds = payload.data.essence.receipt.data.funds

            const firstAccount = $accounts.find((acc) => acc.index === 0)
            const firstAccountAddresses = firstAccount.addresses.map((address) => address.address)

            const receiverAddresses = funds
                .filter((fund) => firstAccountAddresses.includes(fund.output.address))
                .map((fund) => fund.output.address)

            return receiverAddresses
        }

        return []
    }

    const prepareSenderAccount = () => {
        if (payload.type === 'Transaction') {
            return !payload.data.essence.data.incoming
                ? $activeAccount
                : payload.data.essence.data.internal
                ? $accounts.find((acc) => acc.addresses.some((add) => senderAddress === add.address))
                : null
        }

        return null
    }

    const prepareReceiverAccount = () => {
        if (payload.type === 'Milestone') {
            return $accounts.find((acc) => acc.index === 0)
        }

        return payload.data.essence.data.incoming
            ? $activeAccount
            : payload.data.essence.data.internal
            ? $accounts.find((acc) => acc.addresses.some((add) => receiverAddresses.includes(add.address)))
            : null
    }

    const getMilestoneMessageValue = () => {
        const funds = payload.data.essence.receipt.data.funds

        const firstAccount = $accounts.find((acc) => acc.index === 0)
        const firstAccountAddresses = firstAccount.addresses.map((address) => address.address)

        const totalValue = funds
            .filter((fund) => firstAccountAddresses.includes(fund.output.address))
            .reduce((acc, fund) => acc + fund.output.amount, 0)

        return totalValue
    }

    let senderAddress: string = prepareSenderAddress()

    let receiverAddresses: string[] = prepareReceiverAddress()

    $: senderAccount = prepareSenderAccount()

    $: receiverAccount = prepareReceiverAccount()
</script>

<div class="flex flex-col h-full min-h-0">
    <div
        class="px-4 pt-7 pb-3.5 mb-5 rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 {!confirmed && 'opacity-50'}">
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if senderAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold text-center bg-{senderAccount?.color ?? 'blue'}-500 text-white">
                    {getInitials(senderAccount.alias, 2)}
                </div>
                {#if payload.type === 'Transaction' && !payload.data.essence.data.incoming}
                    <Text smaller>{locale('general.you')}</Text>
                {/if}
            {:else}
                <Text smaller>{truncateString(senderAddress, 3, 3, 3)}</Text>
            {/if}
        </div>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <Text bold smaller>
            {formatUnit(payload.type === 'Milestone' ? getMilestoneMessageValue() : payload.data.essence.data.value)}
        </Text>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if receiverAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold bg-{receiverAccount?.color ?? 'blue'}-500 text-white">
                    {getInitials(receiverAccount.alias, 2)}
                </div>
                {#if payload.type === 'Transaction' && payload.data.essence.data.incoming}
                    <Text smaller>{locale('general.you')}</Text>
                {/if}
            {/if}
            {#if payload.type === 'Transaction' && !payload.data.essence.data.incoming}
                {#each receiverAddresses as address}
                    <Text smaller>{truncateString(address, 3, 3, 3)}</Text>
                {/each}
            {/if}
        </div>
    </div>
    <div class="mb-6 h-full overflow-y-auto pr-2 scroll-secondary">
        <div class="mb-5">
            <Text secondary>{locale('general.status')}</Text>
            <Text smaller>{locale(`general.${confirmed ? 'confirmed' : 'pending'}`)}</Text>
        </div>
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
                <Text secondary>{locale('general.messageId')}</Text>
                <button class="text-left" on:click={() => setClipboard(id.toLowerCase())}>
                    <Text type="pre">{id}</Text>
                </button>
            </div>
        {/if}
        {#if senderAddress}
            <div class="mb-5">
                <Text secondary>{locale('general.inputAddress')}</Text>
                <button class="text-left" on:click={() => setClipboard(senderAddress.toLowerCase())}>
                    <Text type="pre">{senderAddress}</Text>
                </button>
            </div>
        {/if}
        {#if receiverAddresses.length > 0}
            <div class="mb-5">
                <Text secondary>{locale('general.receiveAddress')}</Text>
                {#each receiverAddresses as receiver}
                    <button class="text-left" on:click={() => setClipboard(receiver.toLowerCase())}>
                        <Text type="pre" classes="mb-2">{receiver}</Text>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <div class="w-full flex justify-center">
        <button on:click={onBackClick}><Text smaller highlighted>{locale('actions.hideDetails')}</Text></button>
    </div>
</div>

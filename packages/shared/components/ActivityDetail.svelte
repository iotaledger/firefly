<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { convertToFiat, currencies, CurrencyTypes, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { getInitials, truncateString } from 'shared/lib/helpers'
    import { formatDate } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import type { Milestone, Payload, Transaction } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { setClipboard } from 'shared/lib/utils'
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

    export let id
    export let timestamp
    export let confirmed
    export let locale
    export let payload: Payload
    export let onBackClick = () => {}
    export let balance // migration tx

    console.log('THIS IS ME!')

    let cachedMigrationTx = !payload
    let milestonePayload = payload?.type === 'Milestone' ? (payload as Milestone) : undefined
    let txPayload = payload?.type === 'Transaction' ? (payload as Transaction) : undefined

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    let senderAccount: WalletAccount
    let receiverAccount: WalletAccount

    const prepareSenderAddress = () => {
        if (txPayload) {
            return sendAddressFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            return locale('general.legacyNetwork')
        }

        return null
    }

    const prepareReceiverAddresses = () => {
        if (txPayload) {
            return receiverAddressesFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            const funds = milestonePayload.data.essence.receipt.data.funds

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
        if (txPayload) {
            // There can only be one sender address which either belongs to us or not
            return findAccountWithAddress(senderAddress)
        }

        return null
    }

    const prepareReceiverAccount = () => {
        if (milestonePayload) {
            return $accounts.find((acc) => acc.index === 0)
        }

        // For an incoming transaction there might be multiple receiver addresses
        // especially if there was a remainder, so if any account addresses match
        // we need to find the account details for our address match
        if (getIncomingFlag(txPayload) || getInternalFlag(txPayload)) {
            return findAccountWithAnyAddress(receiverAddresses, senderAccount)
        }

        return null
    }

    let senderAddress: string = prepareSenderAddress()
    let receiverAddresses: string[] = prepareReceiverAddresses()
    let receiverAddressesYou: WalletAccount[] = receiverAddresses.map((a) => findAccountWithAddress(a))

    $: senderAccount = prepareSenderAccount()
    $: receiverAccount = prepareReceiverAccount()
    let value = 0
    $: {
        if (cachedMigrationTx) {
            value = balance
        } else if (milestonePayload) {
            value = getMilestoneMessageValue(milestonePayload, $accounts)
        } else if (txPayload) {
            value = txPayload.data.essence.data.value
        }
    }
    $: currencyValue = convertToFiat(value, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings.currency])
</script>

<style type="text/scss">
    .visualization {
        min-height: 84px;
    }
</style>

<div class="flex flex-col h-full min-h-0">
    <div
        class="visualization p-4 pb-3.5 mb-5 rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 {!confirmed && 'opacity-50'}">
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if senderAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold text-center bg-{senderAccount?.color ?? 'blue'}-500 text-white dark:text-gray-900">
                    {getInitials(senderAccount.alias, 2)}
                </div>
                <Text smaller>{locale('general.you')}</Text>
            {:else}
                <Text smaller>{truncateString(senderAddress, 3, 3, 3) || locale('general.unknown')}</Text>
            {/if}
        </div>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <Text bold smaller>{formatUnitBestMatch(value, true, 2)}</Text>
        <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
        <div class="flex flex-col flex-wrap justify-center items-center text-center">
            {#if receiverAccount}
                <div
                    class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold bg-{receiverAccount?.color ?? 'blue'}-500 text-white dark:text-gray-900">
                    {getInitials(receiverAccount.alias, 2)}
                </div>
                <Text smaller>{locale('general.you')}</Text>
            {:else}
                {#each receiverAddresses as address}
                    <Text smaller>{truncateString(address, 3, 3, 3) || locale('general.unknown')}</Text>
                {/each}
            {/if}
        </div>
    </div>
    <div class="mb-6 h-full overflow-y-auto pr-2 -mr-2 scroll-secondary">
        <div class="mb-5">
            <Text secondary>{locale('general.status')}</Text>
            <Text smaller>{locale(`general.${confirmed ? 'confirmed' : 'pending'}`)}</Text>
        </div>
        {#if timestamp}
            <div class="mb-5">
                <Text secondary>{locale('general.date')}</Text>
                <Text smaller>
                    {formatDate(new Date(timestamp), {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
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
                    <Text type="pre">
                        {senderAddress}
                        {#if senderAccount}&nbsp;({senderAccount.alias}){/if}
                    </Text>
                </button>
            </div>
        {/if}
        {#if receiverAddresses.length > 0}
            <div class="mb-5">
                <Text secondary>{locale('general.receiveAddress')}</Text>
                {#each receiverAddresses as receiver, idx}
                    <button class="text-left" on:click={() => setClipboard(receiver.toLowerCase())}>
                        <Text type="pre" classes="mb-2">
                            {receiver}
                            {#if receiverAddressesYou[idx]}&nbsp;({receiverAddressesYou[idx].alias}){/if}
                        </Text>
                    </button>
                {/each}
            </div>
        {/if}
        {#if txPayload || milestonePayload}
            <div class="mb-5">
                <Text secondary>{locale('general.amount')}</Text>
                <div class="flex flex-row">
                    <button class="text-left" on:click={() => setClipboard(formatUnitBestMatch(value))}>
                        <Text>{formatUnitBestMatch(value)}</Text>
                    </button>
                    &nbsp;
                    <button class="text-left" on:click={() => setClipboard(currencyValue.toString())}>
                        <Text highlighted>({formatCurrency(currencyValue)})</Text>
                    </button>
                </div>
            </div>
        {/if}
    </div>

    <div class="w-full flex justify-center">
        <button on:click={onBackClick}><Text smaller highlighted>{locale('actions.hideDetails')}</Text></button>
    </div>
</div>

<script lang="typescript">
    import { CopyButton, Icon, Link, Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { Electron } from 'shared/lib/electron'
    import { getInitials, truncateString } from 'shared/lib/helpers'
    import { formatDate } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import type { Payload } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        findAccountWithAddress,
        findAccountWithAnyAddress,
        getIncomingFlag,
        getInternalFlag,
        getMilestoneMessageValue,
        receiverAddressesFromTransactionPayload,
        sendAddressFromTransactionPayload
    } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { getOfficialExplorer } from 'shared/lib/network';

    export let locale: Locale

    export let id: string
    export let timestamp: string
    export let confirmed: boolean
    export let payload: Payload
    export let balance: number // migration tx

    export let onBackClick = (): void => {}

    const cachedMigrationTx = !payload
    const milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    const txPayload = payload?.type === 'Transaction' ? payload : undefined

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const explorerLink = getOfficialExplorer($accounts[0].clientOptions.network)

    let senderAccount: WalletAccount
    let receiverAccount: WalletAccount

    const prepareSenderAddress = (): string => {
        if (txPayload) {
            return sendAddressFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            return locale('general.legacyNetwork')
        }

        return null
    }

    const prepareReceiverAddresses = (): string[] => {
        if (txPayload) {
            return receiverAddressesFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            const {funds} = milestonePayload.data.essence.receipt.data

            const firstAccount = $accounts.find((acc) => acc.index === 0)
            const firstAccountAddresses = firstAccount.addresses.map((address) => address.address)

            const receiverAddresses = funds
                .filter((fund) => firstAccountAddresses.includes(fund.output.address))
                .map((fund) => fund.output.address)

            return receiverAddresses
        }

        return []
    }

    const prepareSenderAccount = (): WalletAccount => {
        if (txPayload) {
            // There can only be one sender address which either belongs to us or not
            return findAccountWithAddress(senderAddress)
        }

        return null
    }

    const prepareReceiverAccount = (): WalletAccount => {
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

    const senderAddress: string = prepareSenderAddress()
    const receiverAddresses: string[] = prepareReceiverAddresses()
    const receiverAddressesYou: WalletAccount[] = receiverAddresses.map((a) => findAccountWithAddress(a))

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
                <div class="flex flex-row justify-between items-center">
                    <Link
                        onClick={() => Electron.openUrl(`${explorerLink}/message/${id}`)}
                    >
                        <Text highlighted type="pre">{id}</Text>
                    </Link>
                    <CopyButton itemToCopy={id} />
                </div>
            </div>
        {/if}
        {#if senderAddress}
            <div class="mb-5">
                <Text secondary>{locale('general.inputAddress')}</Text>
                <div class="flex flex-row justify-between items-center">
                    <Text type="pre"> {senderAddress} </Text>
                    <CopyButton itemToCopy={senderAddress} />
                </div>
                <Text type="pre">{#if senderAccount} ({senderAccount.alias}) {/if}</Text>
            </div>
        {/if}
        {#if receiverAddresses.length > 0}
            <div class="mb-5">
                <Text secondary>{locale('general.receiveAddress')}</Text>
                {#each receiverAddresses as receiver, idx}
                    <div class="flex flex-row justify-between items-center">
                        <Text type="pre"> {receiver} </Text>
                        <CopyButton itemToCopy={receiver} />
                    </div>
                    <Text type="pre" classes="mb-2 mt-0">
                        {#if receiverAddressesYou[idx]}({receiverAddressesYou[idx].alias}){/if}
                    </Text>
                {/each}
            </div>
        {/if}
        {#if txPayload || milestonePayload}
            <div class="mb-5">
                <Text secondary>{locale('general.amount')}</Text>
                <div class="flex flex-row">
                    <Text bold>{formatUnitBestMatch(value)}</Text>
                    &nbsp;
                    <Text>({formatCurrency(currencyValue)})</Text>
                </div>
            </div>
        {/if}
    </div>

    <div class="w-full flex justify-center">
        <button on:click={onBackClick}><Text smaller highlighted>{locale('actions.hideDetails')}</Text></button>
    </div>
</div>

<style type="text/scss">
    .visualization {
        min-height: 84px;
    }
</style>

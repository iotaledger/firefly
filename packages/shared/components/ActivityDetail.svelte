<script lang="typescript">
    import { CopyButton, Icon, Link, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { getInitials, isBright, truncateString } from 'shared/lib/helpers'
    import { formatDate, localize } from '@core/i18n'
    import { getOfficialExplorer } from 'shared/lib/network'
    import { Platform } from 'shared/lib/platform'
    import { activeProfile, getAccountColor } from 'shared/lib/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { Payload } from 'shared/lib/typings/message'
    import { WalletAccount } from 'shared/lib/typings/wallet'
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
        wallet,
    } from 'shared/lib/wallet'

    export let id: string
    export let timestamp: string
    export let confirmed: boolean
    export let payload: Payload
    export let balance: number // migration tx

    let date = localize('error.invalidDate')
    $: {
        try {
            date = formatDate(new Date(timestamp), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })
        } catch {
            date = localize('error.invalidDate')
        }
    }
    const { accounts } = $wallet

    const cachedMigrationTx = !payload
    const milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    const txPayload = payload?.type === 'Transaction' ? payload : undefined

    const explorerLink = getOfficialExplorer($accounts[0].clientOptions.network)

    let senderAccount: WalletAccount
    let receiverAccount: WalletAccount

    const prepareSenderAddress = (): string => {
        if (txPayload) {
            return sendAddressFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            return localize('general.legacyNetwork')
        }

        return null
    }

    const prepareReceiverAddresses = (): string[] => {
        if (txPayload) {
            return receiverAddressesFromTransactionPayload(txPayload)
        } else if (milestonePayload) {
            const { funds } = milestonePayload.data.essence.receipt.data

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
    $: currencyValue = convertToFiat(
        value,
        $currencies[CurrencyTypes.USD],
        $exchangeRates[$activeProfile?.settings.currency]
    )
    $: senderColor = getAccountColor(senderAccount?.id) as string
    $: receiverColor = getAccountColor(receiverAccount?.id) as string
</script>

{#if $mobile}
    <div class="flex flex-col h-full min-h-0 pt-6 pb-8">
        <div class="w-full text-center">
            <Text bold bigger>{localize('general.activityDetails')}</Text>
        </div>
        <div
            class="p-0 my-5 w-11/12 self-center visualization rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 {!confirmed &&
                'opacity-50'}"
        >
            <div class="flex flex-col flex-wrap justify-center items-center text-center">
                {#if senderAccount}
                    <div
                        style="--account-color: {senderColor}"
                        class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold text-center account-color
                        {isBright(senderColor) ? 'text-gray-900' : 'text-white'}"
                    >
                        {getInitials(senderAccount.alias, 2)}
                    </div>
                    <Text smaller>{localize('general.you')}</Text>
                {:else}
                    <Text smaller>{truncateString(senderAddress, 3, 3, 3) || localize('general.unknown')}</Text>
                {/if}
            </div>
            <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
            <Text bold smaller>{formatUnitBestMatch(value, true, 2)}</Text>
            <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
            <div class="flex flex-col flex-wrap justify-center items-center text-center">
                {#if receiverAccount}
                    <div
                        style="--account-color: {receiverColor}"
                        class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold account-color
                        {isBright(receiverColor) ? 'text-gray-900' : 'text-white'}"
                    >
                        {getInitials(receiverAccount.alias, 2)}
                    </div>
                    <Text smaller>{localize('general.you')}</Text>
                {:else}
                    {#each receiverAddresses as address}
                        <Text smaller>{truncateString(address, 3, 3, 3) || localize('general.unknown')}</Text>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="flex flex-col px-5 h-full overflow-y-auto flex-auto">
            <div class="mb-5">
                <Text secondary>{localize('general.status')}</Text>
                <Text smaller>{localize(`general.${confirmed ? 'confirmed' : 'pending'}`)}</Text>
            </div>
            {#if date}
                <div class="mb-5">
                    <Text secondary>{localize('general.date')}</Text>
                    <Text smaller>{date}</Text>
                </div>
            {/if}
            {#if senderAddress}
                <div class="mb-5">
                    <Text secondary>{localize('general.inputAddress')}</Text>
                    <div class="flex flex-row justify-between items-center">
                        <div on:click={() => setClipboard(senderAddress)}>
                            <Text type="pre" overrideColor classes="text-blue-500">
                                {senderAddress}
                            </Text>
                        </div>
                    </div>
                    <Text type="pre">
                        {#if senderAccount}({senderAccount.alias}){/if}
                    </Text>
                </div>
            {/if}
            {#if receiverAddresses.length > 0}
                <div class="mb-5">
                    <Text secondary>{localize('general.receiveAddress')}</Text>
                    {#each receiverAddresses as receiver, idx}
                        <div class="flex flex-row justify-between items-center">
                            <div on:click={() => setClipboard(receiver)}>
                                <Text type="pre" overrideColor classes="text-blue-500">
                                    {receiver}
                                </Text>
                            </div>
                        </div>
                        <Text type="pre" classes="mb-2 mt-0">
                            {#if receiverAddressesYou[idx]}({receiverAddressesYou[idx].alias}){/if}
                        </Text>
                    {/each}
                </div>
            {/if}
            <div class="flex justify-center">
                <button
                    class="mobile-explorer-button action p-3 w-full text-center rounded-lg font-semibold text-14 bg-white dark:bg-gray-800 text-blue-500"
                    on:click={() => Platform.openUrl(`${explorerLink}/message/${id}`)}
                >
                    <Text fontWeight="font-500" highlighted>{localize('general.openExplorer')}</Text>
                </button>
            </div>
        </div>
    </div>
{:else}
    <div class="flex flex-col h-full min-h-0">
        <div
            class="p-4 pb-3.5 visualization mb-5 rounded-xl text-center items-center justify-center flex flex-row bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 {!confirmed &&
                'opacity-50'}"
        >
            <div class="flex flex-col flex-wrap justify-center items-center text-center">
                {#if senderAccount}
                    <div
                        style="--account-color: {senderColor}"
                        class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold text-center account-color
                        {isBright(senderColor) ? 'text-gray-900' : 'text-white'}"
                    >
                        {getInitials(senderAccount.alias, 2)}
                    </div>
                    <Text smaller>{localize('general.you')}</Text>
                {:else}
                    <Text smaller>{truncateString(senderAddress, 3, 3, 3) || localize('general.unknown')}</Text>
                {/if}
            </div>
            <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
            <Text bold smaller>{formatUnitBestMatch(value, true, 2)}</Text>
            <Icon icon="small-chevron-right" classes="mx-4 text-gray-500 dark:text-white" />
            <div class="flex flex-col flex-wrap justify-center items-center text-center">
                {#if receiverAccount}
                    <div
                        style="--account-color: {receiverColor}"
                        class="flex items-center justify-center w-8 h-8 rounded-xl p-2 mb-2 text-12 leading-100 font-bold account-color
                        {isBright(receiverColor) ? 'text-gray-900' : 'text-white'}"
                    >
                        {getInitials(receiverAccount.alias, 2)}
                    </div>
                    <Text smaller>{localize('general.you')}</Text>
                {:else}
                    {#each receiverAddresses as address}
                        <Text smaller>{truncateString(address, 3, 3, 3) || localize('general.unknown')}</Text>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="pr-2 -mr-2 h-1 scroll-secondary mb-6 overflow-y-auto flex-auto">
            <div class="mb-5">
                <Text secondary>{localize('general.status')}</Text>
                <Text smaller>{localize(`general.${confirmed ? 'confirmed' : 'pending'}`)}</Text>
            </div>
            {#if date}
                <div class="mb-5">
                    <Text secondary>{localize('general.date')}</Text>
                    <Text smaller>{date}</Text>
                </div>
            {/if}
            {#if id}
                <div class="mb-5">
                    <Text secondary>{localize('general.messageId')}</Text>
                    <div class="flex flex-row justify-between items-center">
                        <Link onClick={() => Platform.openUrl(`${explorerLink}/message/${id}`)}>
                            <Text highlighted type="pre">{id}</Text>
                        </Link>
                        <CopyButton itemToCopy={id} />
                    </div>
                </div>
            {/if}
            {#if senderAddress}
                <div class="mb-5">
                    <Text secondary>{localize('general.inputAddress')}</Text>
                    <div class="flex flex-row justify-between items-center">
                        <Text type="pre">{senderAddress}</Text>
                        <CopyButton itemToCopy={senderAddress} />
                    </div>
                    <Text type="pre">
                        {#if senderAccount}({senderAccount.alias}){/if}
                    </Text>
                </div>
            {/if}
            {#if receiverAddresses.length > 0}
                <div class="mb-5">
                    <Text secondary>{localize('general.receiveAddress')}</Text>
                    {#each receiverAddresses as receiver, idx}
                        <div class="flex flex-row justify-between items-center">
                            <Text type="pre">{receiver}</Text>
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
                    <Text secondary>{localize('general.amount')}</Text>
                    <div class="flex flex-row">
                        <Text bold>{formatUnitBestMatch(value)}</Text>
                        &nbsp;
                        <Text>({formatCurrency(currencyValue)})</Text>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style type="text/scss">
    .mobile-explorer-button {
        /* Tailwind border classes doesn't have an effect */
        border: 1px solid rgba(154, 173, 206, 0.25);
    }
    .visualization {
        min-height: 84px;
    }

    .account-color {
        background-color: var(--account-color);
    }
</style>

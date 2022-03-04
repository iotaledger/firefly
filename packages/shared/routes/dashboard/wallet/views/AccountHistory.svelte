<script lang="typescript">
    import { ActivityDetail, ActivityRow, Icon, Text, Input } from 'shared/components'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { Locale } from 'shared/lib/typings/i18n'
    import {
        api,
        isSyncing,
        selectedAccountId,
        selectedMessage,
        sendAddressFromTransactionPayload,
        receiverAddressesFromTransactionPayload,
        getIncomingFlag,
    } from 'shared/lib/wallet'
    import { AccountMessage } from 'shared/lib/typings/wallet'
    import { Transaction } from 'shared/lib/typings/message'
    import { debounce, unitToValue, isValueInUnitRange } from 'shared/lib/utils'
    import { formatUnitBestMatch } from 'shared/lib/units'

    export let locale: Locale

    export let transactions: AccountMessage[] = []
    export let color = 'blue'

    function handleTransactionClick(transaction: AccountMessage): void {
        selectedMessage.set(transaction)
    }

    function handleBackClick(): void {
        selectedMessage.set(null)
    }

    const handleSyncAccountClick = () => {
        if (!$isSyncing) {
            const _syncAccount = () => {
                $isSyncing = true
                api.syncAccount($selectedAccountId, {
                    onSuccess() {
                        $isSyncing = false
                    },
                    onError(err) {
                        $isSyncing = false

                        const shouldHideErrorNotification =
                            err && err.type === 'ClientError' && err.error === 'error.node.chrysalisNodeInactive'
                        if (!shouldHideErrorNotification) {
                            if ($isLedgerProfile) {
                                displayNotificationForLedgerProfile('error', true, true, false, false, err)
                            } else {
                                showAppNotification({
                                    type: 'error',
                                    message: locale(err.error),
                                })
                            }
                        }
                    },
                })
            }

            if ($isSoftwareProfile) {
                api.getStrongholdStatus({
                    onSuccess(strongholdStatusResponse) {
                        if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                            openPopup({
                                type: 'password',
                                props: { onSuccess: () => _syncAccount() },
                            })
                        } else {
                            void _syncAccount()
                        }
                    },
                    onError(err) {
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
                        })
                    },
                })
            } else {
                void _syncAccount()
            }
        }
    }

    const filters = ['all', 'incoming', 'outgoing']
    $: activeFilterIndex = searchActive ? 0 : activeFilterIndex || 0

    let searchActive = false
    let inputElement: HTMLInputElement
    let searchValue: string
    $: if (searchActive && inputElement) inputElement.focus()
    $: searchValue = searchActive ? searchValue.toLowerCase() : ''

    let filteredTransactions = transactions
    $: switch (activeFilterIndex) {
        case 0:
            filteredTransactions = transactions
            break
        case 1:
            filteredTransactions = transactions.filter((transaction) => getIncomingFlag(transaction?.payload))
            break
        case 2:
            filteredTransactions = transactions.filter((transaction) => !getIncomingFlag(transaction?.payload))
            break
        default:
            filteredTransactions = transactions
    }

    let queryTransactions = filteredTransactions

    function search() {
        if (searchValue) {
            queryTransactions = filteredTransactions.filter((transaction) => {
                const transactionValue = (transaction?.payload as Transaction)?.data?.essence?.data?.value
                return (
                    sendAddressFromTransactionPayload(transaction?.payload) === searchValue ||
                    receiverAddressesFromTransactionPayload(transaction?.payload).find(
                        (addr) => addr === searchValue
                    ) ||
                    transaction?.id.toLowerCase() === searchValue ||
                    (searchValue[0] === '>' && unitToValue(searchValue.substring(1)) < transactionValue) ||
                    (searchValue[0] === '<' && unitToValue(searchValue.substring(1)) > transactionValue) ||
                    (searchValue[1] === 'i' && isValueInUnitRange(transactionValue, searchValue)) ||
                    transactionValue === unitToValue(searchValue) ||
                    formatUnitBestMatch(transactionValue).toString().toLowerCase()?.includes(searchValue)
                )
            })
        }
    }

    $: if (searchActive && searchValue) {
        debounce(search)()
    } else {
        queryTransactions = filteredTransactions
    }
</script>

<div class="h-full p-8 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-5">
        {#if $selectedMessage}
            <button class="flex flex-row space-x-2 items-center" on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h5">{locale('general.transactions')}</Text>
            </button>
        {:else}
            <div class="flex flex-1 flex-row justify-between">
                <Text type="h5"
                    >{locale('general.transactions')}
                    <span class="text-gray-500 font-bold">• {queryTransactions.length}</span></Text
                >
                {#if !$selectedMessage}
                    <button on:click={handleSyncAccountClick} class:pointer-events-none={$isSyncing}>
                        <Icon
                            icon="refresh"
                            classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                        />
                    </button>
                {/if}
            </div>
            <div class="relative flex flex-row items-center justify-between text-white mt-4">
                <ul class="flex flex-row justify-between space-x-8">
                    {#each filters as filter, i}
                        <li on:click={() => (activeFilterIndex = i)}>
                            <Text
                                type="p"
                                overrideColor
                                classes="cursor-pointer
                            {activeFilterIndex === i
                                    ? 'text-blue-500 border-b-2 border-blue-500 border-solid'
                                    : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}"
                            >
                                {locale(`general.${filter}`)}
                            </Text>
                        </li>
                    {/each}
                </ul>
                <button on:click={() => (searchActive = !searchActive)}>
                    <Icon
                        icon="search"
                        classes="text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-100
                    cursor-pointer ml-2"
                    />
                </button>
                <div
                    class="z-0 flex items-center absolute left-0 transition-all {searchActive
                        ? 'w-full'
                        : 'w-0'} overflow-hidden"
                >
                    <Icon icon="search" classes="z-10 absolute left-2 text-gray-500" />
                    <Input bind:value={searchValue} classes="z-0" style="padding: 0.75rem  2.5rem;" bind:inputElement />
                    <button on:click={() => (searchActive = !searchActive)} class="z-10 absolute right-2">
                        <Icon icon="close" classes="text-gray-500 hover:text-blue-500" />
                    </button>
                </div>
            </div>
        {/if}
    </div>
    {#if $selectedMessage}
        <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} {locale} />
    {:else}
        <div class="overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
            {#if queryTransactions.length}
                {#each queryTransactions as transaction}
                    <ActivityRow
                        onClick={() => handleTransactionClick(transaction)}
                        {...transaction}
                        {color}
                        {locale}
                    />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{locale('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>

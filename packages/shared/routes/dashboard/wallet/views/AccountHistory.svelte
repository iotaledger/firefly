<script lang="typescript">
    import { ActivityDetail,ActivityRow,Icon,Text,Input } from 'shared/components';
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger';
    import { showAppNotification } from 'shared/lib/notifications';
    import { openPopup } from 'shared/lib/popup';
    import { isLedgerProfile,isSoftwareProfile } from 'shared/lib/profile';
    import type { Locale } from 'shared/lib/typings/i18n';
    import type { AccountMessage } from 'shared/lib/typings/wallet';
    import { api,isSyncing,selectedAccountId,selectedMessage,sendAddressFromTransactionPayload,receiverAddressesFromTransactionPayload } from 'shared/lib/wallet';

    export let locale: Locale

    export let transactions: AccountMessage[] = []
    export let color = 'blue'

    function handleTransactionClick(transaction: AccountMessage): void {
        selectedMessage.set(transaction)
    }

    function handleBackClick(): void  {
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
    let activeFilterIndex = 0

    let searchActive = false
    $: searchValue = searchActive ? searchValue : ''

    let filteredTransactions = transactions
    $: switch (activeFilterIndex) {
        case 0:
            filteredTransactions = transactions
            break
        case 1:
            filteredTransactions = transactions.filter(transaction => transaction.payload.data.essence.data.incoming)
            break
        case 2:
            filteredTransactions = transactions.filter(transaction => !transaction.payload.data.essence.data.incoming)
            break
        default:
            filteredTransactions = transactions
    }

    let queryTransactions = filteredTransactions
    $: if (searchValue) {
        queryTransactions = filteredTransactions.filter(transaction => {
            return transaction?.payload.data?.essence?.data?.value?.toString()?.includes(searchValue) ||
                sendAddressFromTransactionPayload(transaction?.payload).includes(searchValue) ||
                receiverAddressesFromTransactionPayload(transaction?.payload).find(addr => addr.includes(searchValue))
        })
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
                <Text type="h5">{locale('general.transactions')} <span class="text-gray-500">• {queryTransactions.length}</span></Text>
                {#if !$selectedMessage}
                    <button on:click={handleSyncAccountClick} class:pointer-events-none={$isSyncing}>
                        <Icon
                            icon="refresh"
                            classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
                    </button>
                {/if}
            </div>
            <div class="flex flex-row justify-between text-white mt-4">
                <ul class="flex flex-row justify-between">
                    {#each filters as filter, i}
                        <li on:click={() => activeFilterIndex = i}>
                            <Text type="p" overrideColor classes="cursor-pointer mr-8
                            {activeFilterIndex === i ? "text-blue-500 border-b-2 border-blue-500 border-solid" : "text-gray-500 hover:text-gray-600"}">
                                {locale(`general.${filter}`)}
                            </Text>
                        </li>
                    {/each}
                </ul>
                <button on:click={() => (searchActive = !searchActive)}>
                    <Icon icon={searchActive ? 'close' : 'search'} classes="text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-100
                    cursor-pointer ml-2" />
                </button>
            </div>
            <Input classes={searchActive ? 'mt-2' : 'hidden'} bind:value={searchValue} />
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
                        {locale} />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{locale('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>

<script lang="typescript">
    import { ActivityDetail, ActivityRow, Icon, Text, Input, Drawer } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { mobile } from 'shared/lib/app'
    import { walletSetupType } from 'shared/lib/router'
    import {
        api,
        isSyncing,
        getIncomingFlag,
        isFirstSessionSync,
        selectedAccount,
        selectedMessage,
        sendAddressFromTransactionPayload,
        receiverAddressesFromTransactionPayload,
    } from 'shared/lib/wallet'
    import { Transaction } from 'shared/lib/typings/message'
    import { SetupType } from 'shared/lib/typings/routes'
    import { AccountMessage } from 'shared/lib/typings/wallet'
    import { debounce, unitToValue, isValueInUnitRange } from 'shared/lib/utils'
    import { formatUnitBestMatch } from 'shared/lib/units'

    export let transactions: AccountMessage[] = []
    export let color = 'blue'

    let drawer: Drawer

    function handleTransactionClick(transaction: AccountMessage): void {
        selectedMessage.set(transaction)
        if ($mobile) {
            drawer.open()
        }
    }

    function handleBackClick(): void {
        selectedMessage.set(null)
    }

    const handleSyncAccountClick = () => {
        if (!$isSyncing) {
            const _syncAccount = () => {
                $isSyncing = true
                api.syncAccount($selectedAccount?.id, {
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
                                    message: localize(err.error),
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
                            message: localize(err.error),
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

    function shouldShowFirstSync(): boolean {
        /**
         * NOTE: The following conditions must be satisfied
         * for the "syncing history, ..." message to show:
         *
         *      1. It must be the first sync of the user's session
         *      2. The wallet setup type must exist (a null value indicates an existing profile)
         *      3. The wallet setup type cannot be new (if it's new then there's no tx history to sync)
         *      4. Account must have no transactions (the length of $transactions must be zero)
         */
        return (
            $isFirstSessionSync && $walletSetupType && $walletSetupType !== SetupType.New && transactions.length === 0
        )
    }
</script>

<div class="{$mobile ? 'pt-4 px-6 pb-8' : 'p-8'} h-full  flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-5">
        {#if $selectedMessage && !$mobile}
            <button class="flex flex-row space-x-2 items-center" on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h5">{localize('general.transactions')}</Text>
            </button>
        {:else}
            <div class="flex flex-1 flex-row justify-between">
                {#if !$mobile}
                    <Text type="h5">
                        {localize('general.transactions')}
                        <span class="text-gray-500 font-bold">• {queryTransactions.length}</span>
                    </Text>
                    {#if !$selectedMessage}
                        <button on:click={handleSyncAccountClick} class:pointer-events-none={$isSyncing}>
                            <Icon
                                icon="refresh"
                                classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                            />
                        </button>
                    {/if}
                {/if}
            </div>
            <div class="relative flex flex-row items-center justify-between text-white mt-4">
                <ul
                    class="{$mobile
                        ? 'bg-gray-100 h-10 items-center rounded-xl space-x-3 p-1'
                        : 'space-x-8'} flex flex-row justify-between "
                >
                    {#each filters as filter, i}
                        <li on:click={() => (activeFilterIndex = i)}>
                            <Text
                                type={$mobile ? 'h5' : 'p'}
                                overrideColor
                                classes="cursor-pointer
                            {activeFilterIndex === i
                                    ? `${
                                          $mobile
                                              ? 'flex justify-center items-center rounded-xl bg-white h-8 w-20'
                                              : 'border-b-2 border-blue-500 border-solid'
                                      } text-blue-500`
                                    : `${
                                          $mobile ? 'flex justify-center items-center h-8 w-20' : ''
                                      } text-gray-500 hover:text-gray-600 dark:hover:text-gray-300`}"
                            >
                                {localize(`general.${filter}`)}
                            </Text>
                        </li>
                    {/each}
                </ul>
                <button on:click={() => (searchActive = !searchActive)}>
                    <div
                        class={$mobile &&
                            'flex border-solid border bg-gray-100 dark:bg-gray-500 rounded-xl h-10 w-10 justify-center items-center'}
                    >
                        <Icon
                            icon="search"
                            height={$mobile ? '26' : '24'}
                            width={$mobile ? '26' : '24'}
                            classes="{$mobile
                                ? 'text-blue-500'
                                : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-100 ml-2'} dark:text-white 
                    cursor-pointer "
                        />
                    </div>
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
    {#if $selectedMessage && !$mobile}
        <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} />
    {:else}
        <div class="overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
            {#if $isSyncing && shouldShowFirstSync()}
                <Text secondary classes="text-center">{localize('general.firstSync')}</Text>
            {:else if queryTransactions.length}
                {#each queryTransactions as transaction}
                    <ActivityRow onClick={() => handleTransactionClick(transaction)} {...transaction} {color} />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{localize('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    {/if}
    {#if $selectedMessage && $mobile}
        <Drawer opened={true} bind:this={drawer}>
            <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} />
        </Drawer>
    {/if}
</div>

<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDetail, ActivityRow, Icon, Input, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { getMessageParticipationAction } from 'shared/lib/participation'
    import { ParticipationAction } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { Transaction } from 'shared/lib/typings/message'
    import { SetupType } from 'shared/lib/typings/setup'
    import { AccountMessage } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { debounce, isValueInUnitRange, unitToValue } from 'shared/lib/utils'
    import {
        api,
        currentSyncingAccountStore,
        getAccountSyncOptions,
        getIncomingFlag,
        isFirstSessionSync,
        isParticipationPayload,
        isSyncing,
        receiverAddressesFromTransactionPayload,
        selectedAccountIdStore,
        selectedAccountStore,
        selectedMessage,
        sendAddressFromTransactionPayload,
        walletSetupType,
    } from 'shared/lib/wallet'

    export let transactions: AccountMessage[] = []
    export let scroll = true
    export let scrollDetection = (node: Element): void => {}
    export let bottomOffset = '0px'

    function handleTransactionClick(transaction: AccountMessage): void {
        selectedMessage.set(transaction)
    }

    function handleBackClick(): void {
        selectedMessage.set(null)
    }

    $: isSelectedAccountSyncing = $currentSyncingAccountStore?.id === $selectedAccountIdStore || $isSyncing

    const handleSyncAccountClick = () => {
        if (!$isSyncing) {
            const _syncAccount = () => {
                $isSyncing = true
                const { gapLimit } = getAccountSyncOptions()

                api.syncAccount(
                    $selectedAccountStore?.id,
                    { gapLimit },
                    {
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
                    }
                )
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
                const participationAction = getMessageParticipationAction(transaction.id, transaction.timestamp)
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
                    formatUnitBestMatch(transactionValue).toString().toLowerCase()?.includes(searchValue) ||
                    // literal string match with participation actions
                    (transaction?.payload?.type === 'Transaction' &&
                        isParticipationPayload(transaction?.payload) &&
                        getParticipationActionLocale(participationAction)?.toLowerCase()?.includes(searchValue))
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

    function getParticipationActionLocale(action: ParticipationAction): string {
        switch (action) {
            case ParticipationAction.Stake:
                return localize('general.stakingTransaction')
            case ParticipationAction.Vote:
                return localize('general.votingTransaction')
            case ParticipationAction.Unstake:
                return localize('general.unstakingTransaction')
            case ParticipationAction.Unvote:
                return localize('general.unvotingTransaction')
            default:
                return localize('general.participationTransaction')
        }
    }

    function handleSearch(e) {
        searchActive = true
        if (e.detail === 'BACKSPACE') {
            searchValue = searchValue.slice(0, -1)
            return
        }
        searchValue += e.detail ?? ''
    }
</script>

<div class="h-full p-6 {$mobile ? 'px-5' : ''} flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-5">
        {#if $selectedMessage && !$mobile}
            <button class="flex flex-row space-x-2 items-center" on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="text-blue-500" />
                <Text type="h5">{localize('general.transactions')}</Text>
            </button>
        {:else}
            <div class="flex flex-1 flex-row justify-between">
                <Text type="h5">
                    {localize('general.transactions')}
                    <span class="text-gray-500 font-bold">• {queryTransactions.length}</span>
                </Text>
                <button on:click={handleSyncAccountClick} class:pointer-events-none={isSelectedAccountSyncing}>
                    <Icon
                        icon="refresh"
                        classes="{isSelectedAccountSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                    />
                </button>
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
                                {localize(`general.${filter}`)}
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
    {#if $selectedMessage && !$mobile}
        <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} />
    {:else}
        <div
            class="activity-wrapper flex-auto h-1 space-y-2.5 -mr-2 pr-2 pb-4 {scroll
                ? 'overflow-y-auto scroll-secondary'
                : ''}"
            style="--bottom-offset: {bottomOffset}"
            use:scrollDetection
        >
            {#if $isSyncing && shouldShowFirstSync()}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary classes="text-center">{localize('general.firstSync')}</Text>
                </div>
            {:else if queryTransactions.length}
                {#each queryTransactions as transaction}
                    <ActivityRow onClick={() => handleTransactionClick(transaction)} {...transaction} />
                {/each}
            {:else}
                <div
                    class="h-full flex flex-col items-center {$mobile ? 'justify-start' : 'justify-center'} text-center"
                >
                    <Text secondary>{localize('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .activity-wrapper {
        margin-bottom: var(--bottom-offset);
    }
</style>

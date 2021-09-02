<script lang="typescript">
    import { ActivityRow, Icon, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute, walletSetupType } from 'shared/lib/router'
    import { AccountRoutes, SetupType, WalletRoutes } from 'shared/lib/typings/routes'
    import {
        api,
        asyncSyncAccounts,
        getSyncAccountOptions,
        isFirstSessionSync,
        isSyncing,
        selectedAccountId,
        selectedMessage,
        isFirstManualSync
    } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'
    import { AccountMessage, WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const transactions = getContext<Readable<AccountMessage[]>>('walletTransactions')

    function handleTransactionClick(transaction) {
        const sourceAccount = get(accounts).find((acc) => acc.index === transaction.account)
        if (sourceAccount) {
            selectedAccountId.set(sourceAccount.id)
            selectedMessage.set(transaction)
            walletRoute.set(WalletRoutes.Account)
            accountRoute.set(AccountRoutes.Init)
        } else {
            console.error('Could not find source account')
        }
    }

    function handleSyncAccountOptions() {
        if(get(isFirstManualSync)) {
            isFirstManualSync.set(true)

            return {
                gapLimit: $isSoftwareProfile ? 10 : 1,
                accountDiscoveryThreshold: 1
            }
        } else {
            return getSyncAccountOptions(true)
        }
    }

    function handleSyncClick() {
        const { gapLimit, accountDiscoveryThreshold } = handleSyncAccountOptions()

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({
                            type: 'password',
                            props: { onSuccess: async () => asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false) }
                        })
                    } else {
                        void asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)
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
            void asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold)
        }
    }

    function shouldShowFirstSync() {
        /**
         * NOTE: The following conditions must be satisfied
         * for the "syncing history, ..." message to show:
         *
         *      1. It must be the first sync of the user's session
         *      2. The wallet setup type must exist (a null value indicates an existing profile)
         *      3. The wallet setup type cannot be new (if it's new then there's no tx history to sync)
         *      4. Account must have no transactions (the length of $transactions must be zero)
         */
        return $isFirstSessionSync &&
            $walletSetupType &&
            $walletSetupType !== SetupType.New &&
            $transactions.length === 0
    }
</script>

<div data-label="latest-transactions" class="h-full pt-6 pb-8 px-8 flex-grow flex flex-col">
    <div class="w-full flex flex-row justify-between items-start">
        <Text type="h5" classes="mb-5">{locale('general.latestTransactions')}</Text>
        <button on:click={() => handleSyncClick()} class:pointer-events-none={$isSyncing}>
            <Icon icon="refresh" classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
        </button>
    </div>
    <div class="overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
        {#if $isSyncing && shouldShowFirstSync()}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{locale('general.firstSync')}</Text>
            </div>
        {:else if $transactions?.length}
            {#each $transactions as transaction}
                <ActivityRow
                    {...transaction}
                    onClick={() => handleTransactionClick(transaction)}
                    color={$accounts.find((acc) => acc.index === transaction.account)?.color}
                    {locale}
                    includeFullSender />
            {/each}
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{locale('general.noRecentHistory')}</Text>
            </div>
        {/if}
    </div>
</div>

<script lang="typescript">
    import { getContext } from 'svelte'
    import { get, Readable, Writable } from 'svelte/store'
    import { ActivityRow, Drawer, Icon, Text, TransactionTabs } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { accountRouter, AccountRoute, walletRouter, WalletRoute } from '@core/router'
    import { SyncAccountOptions } from 'shared/lib/typings/account'
    import { Locale } from 'shared/lib/typings/i18n'
    import { AccountMessage, WalletAccount } from 'shared/lib/typings/wallet'
    import {
        api,
        asyncSyncAccounts,
        getSyncAccountOptions,
        isFirstManualSync,
        isFirstSessionSync,
        isSyncing,
        selectedAccountId,
        selectedMessage,
        walletSetupType,
    } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/setup'

    export let locale: Locale

    let drawer: Drawer

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const transactions = getContext<Readable<AccountMessage[]>>('walletTransactions')

    function handleTransactionClick(transaction: AccountMessage): void {
        const sourceAccount = get(accounts).find((acc) => acc.index === transaction.account)
        if (sourceAccount) {
            selectedAccountId.set(sourceAccount.id)
            selectedMessage.set(transaction)
            $walletRouter.goTo(WalletRoute.Account)
        } else {
            console.error('Could not find source account')
        }
        $accountRouter.goTo(AccountRoute.Init)
        if ($mobile) {
            drawer.open()
        }
    }

    function handleSyncAccountOptions(): SyncAccountOptions {
        if (get(isFirstManualSync)) {
            isFirstManualSync.set(true)

            return {
                gapLimit: $isSoftwareProfile ? 10 : 1,
                accountDiscoveryThreshold: 1,
            }
        } else {
            return getSyncAccountOptions(true)
        }
    }

    function handleSyncClick(): void {
        const { gapLimit, accountDiscoveryThreshold } = handleSyncAccountOptions()

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({
                            type: 'password',
                            props: {
                                onSuccess: async () => asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false),
                            },
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
            $isFirstSessionSync && $walletSetupType && $walletSetupType !== SetupType.New && $transactions.length === 0
        )
    }
</script>

{#if $mobile}
    <div data-label="latest-transactions" style="height: calc(100vh / 2.1)" class="pt-6 pb-0 px-6">
        <TransactionTabs let:item={transaction} list={$transactions} {locale}>
            {#if $isSyncing && shouldShowFirstSync()}
                <Text secondary classes="text-center">{locale('general.firstSync')}</Text>
            {:else if $transactions?.length}
                <ActivityRow
                    {...transaction}
                    onClick={() => handleTransactionClick(transaction)}
                    color={$accounts.find((acc) => acc.index === transaction.account)?.color}
                    {locale}
                    includeFullSender
                />
            {:else}
                <Text secondary classes="text-center">{locale('general.noRecentHistory')}</Text>
            {/if}
        </TransactionTabs>
    </div>
    <Drawer bind:this={drawer} dimLength={200} opened={false}>
        <!-- 👉 mockup data - replace by component route -->
        <div class="p-5 overflow-y-scroll h-full scroll-secondary">
            <Text type="h3">Transaction</Text>
            <div class="mt-10">
                <Text secondary>Reference</Text>
                <Text>For the pizza</Text>
            </div>
            <div class="mt-10 pr-5">
                <Text secondary>Input Address</Text>
                <Text type="pre">iota1qq2hdmvm9k3z5uvq6atreclgy6gc98dpshj3nd872jgqyn3dstzdvkx9crx</Text>
            </div>
            <div class="mt-10">
                <Text secondary>Receive Address</Text>
                <Text type="pre">iota1qq2hdmvm9k3z5uvq6atreclgy6gc98dpshj3nd872jgqyn3dstzdvkx9crx</Text>
            </div>
        </div>
        <!-- end mockup data -->
    </Drawer>
{:else}
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
                        includeFullSender
                    />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{locale('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    </div>
{/if}

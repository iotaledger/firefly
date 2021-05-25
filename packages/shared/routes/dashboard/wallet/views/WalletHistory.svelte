<script lang="typescript">
    import { ActivityRow, Icon, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import {
        AccountMessage,
        api,
        asyncSyncAccounts,
        isSyncing,
        selectedAccountId,
        selectedMessage,
        WalletAccount,
    } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { get } from 'svelte/store'

    export let locale

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

    function handleSyncClick() {
        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: async () => asyncSyncAccounts(0, 10, 1, false) } })
                    } else {
                        const gapLimit = $activeProfile?.gapLimit
                        asyncSyncAccounts(gapLimit === undefined ? undefined : 0, gapLimit, 1, false)
                        updateProfile('gapLimit', undefined)
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
            const gapLimit = $activeProfile?.gapLimit
            asyncSyncAccounts(gapLimit === undefined ? undefined : 0, gapLimit, 1, false)
            updateProfile('gapLimit', undefined)
        }
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
        {#if $activeProfile?.gapLimit === 50 && $isSyncing}
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

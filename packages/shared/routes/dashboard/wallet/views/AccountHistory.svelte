<script lang="typescript">
    import { ActivityDetail, ActivityRow, Icon, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { api, isSyncing, selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { isLedgerProfile } from 'shared/lib/profile'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { Locale } from 'shared/lib/typings/i18n'
    import { AccountMessage } from '../../../../lib/typings/wallet'
    import { aggregateParticipationMessages } from '../../../../lib/participation'

    export let locale: Locale

    export let transactions = []
    export let color = 'blue'

    $: console.log('TXs: ', transactions)

    function handleTransactionClick(transaction) {
        selectedMessage.set(transaction)
    }

    function handleBackClick() {
        selectedMessage.set(null)
    }

    const handleSyncAccountClick = () => {
        if (!$isSyncing) {
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
                }
            })
        }
    }

    const getTransactions = (): AccountMessage[] => {
        return aggregateParticipationMessages(transactions)
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
                <Text type="h5">{locale('general.transactions')}</Text>
                {#if !$selectedMessage}
                    <button on:click={handleSyncAccountClick} class:pointer-events-none={$isSyncing}>
                        <Icon icon="refresh" classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
                    </button>
                {/if}
            </div>
        {/if}
    </div>
    {#if $selectedMessage}
        <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} {locale} />
    {:else}
        <div class="overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
            {#if transactions.length}
                {#each getTransactions() as transaction}
                    <ActivityRow onClick={() => handleTransactionClick(transaction)} {...transaction} {color} {locale} />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{locale('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>

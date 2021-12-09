<script lang="typescript">
    import { ActivityDetail, ActivityRow, Icon, Text } from 'shared/components'
    import { displayNotificationForLedgerProfile } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { api, isSyncing, selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { chunkString, toHexString, toUtf8String } from 'shared/lib/utils'
    import type { Locale } from 'shared/lib/typings/i18n'
    import type { AccountMessage } from 'shared/lib/typings/wallet'

    export let locale: Locale

    export let transactions = []
    export let color = 'blue'

    $: console.log('TX PAYLOADs: ', transactions.slice(0, 10).map((tx) => {
        const embeddedData = tx.payload.data.essence.data.payload?.data
        if (!embeddedData) return ''

        return [
            toUtf8String(embeddedData?.index),
            chunkString(
                toHexString(embeddedData?.data),
                64
            )
        ]
    }))

    function handleTransactionClick(transaction) {
        selectedMessage.set(transaction)
    }

    function handleBackClick() {
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

    const getTransactions = (): AccountMessage[] => {        
        return transactions
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
                        <Icon
                            icon="refresh"
                            classes="{$isSyncing && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
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

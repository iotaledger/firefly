<script lang="typescript">
    import { Icon, Modal, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { WalletAccount, api, selectedAccountId, isSyncing } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { NotificationData, NOTIFICATION_TIMEOUT_NEVER, showAppNotification, updateDisplayNotification } from 'shared/lib/notifications'

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    export let isActive
    export let locale

    const handleCustomiseAccountClick = () => {
        accountRoute.set(AccountRoutes.Manage)
        isActive = false
    }
    const handleSyncAccountClick = () => {
        if (!$isSyncing) {
            $isSyncing = true

            const notificationData: NotificationData = {
                type: 'info',
                message: locale("general.accountSyncing"),
                timeout: NOTIFICATION_TIMEOUT_NEVER
            }

            const notificationId = showAppNotification(notificationData)

            api.syncAccount($selectedAccountId, {
                onSuccess() {
                    updateDisplayNotification(notificationId, {
                        ...notificationData,
                        message: locale("general.accountSyncComplete"),
                        timeout: undefined
                    })
                    $isSyncing = false
                },
                onError(err) {
                    updateDisplayNotification(notificationId, {
                        ...notificationData,
                        type: "error",
                        message: locale(err.error),
                        timeout: undefined
                    })
                    $isSyncing = false
                },
            })
        }
        isActive = false
    }
    const handlViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory', props: { account } })
        isActive = false
    }
    const handleDeleteAccountClick = () => {
        openPopup({
            type: 'deleteAccount',
            props: {
                account,
                hasMultipleAccounts: $accounts.length > 1,
                deleteAccount: (id) => {
                    accounts.update((_accounts) => _accounts.filter((_account) => _account.id !== id))
                },
            },
        })
        isActive = false
    }
</script>

<Modal bind:isActive position={{ top: '121px', right: 'calc((100% + 43px) * 0.6666666)' }}>
    <div class="flex flex-col">
        <!-- Customize -->
        <button
            on:click={() => handleCustomiseAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon icon="customize" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.customize_account`)}</Text>
        </button>
        <!-- Sync -->
        <button
            on:click={() => handleSyncAccountClick()}
            disabled={$isSyncing}
            class={`group flex flex-row justify-start items-center py-3 px-3 w-full ${$isSyncing ? "cursor-auto opacity-30" : "hover:bg-blue-50"}`}>
            <Icon icon="refresh" classes={`text-gray-500 ml-1 mr-3 ${$isSyncing ? "" : "group-hover:text-blue-500"}`} />
            <Text smaller classes={`${$isSyncing ? "" : "group-hover:text-blue-500"}`}>{locale(`actions.sync_account`)}</Text>
        </button>
        <!-- Address history -->
       <!-- TODO: Implement and enable -->
        <button
            disabled
            on:click={() => handlViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full opacity-50 pointer-events-none">
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.view_address_history`)}</Text>
        </button>
        <hr class="border-t border-solid border-gray-200 dark:border-gray-700" />
        <!-- Delete -->
        <button
            on:click={() => handleDeleteAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-red-50 py-4 px-3 w-full">
            <Icon icon="delete" classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>{locale(`actions.delete_account`)}</Text>
        </button>
    </div>
</Modal>

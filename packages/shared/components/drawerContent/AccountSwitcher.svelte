<script lang="typescript">
    import { HR, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { resetAccountRouter, accountRouter, AccountRoute, resetWalletRoute } from '@core/router'
    import { mobile } from '@lib/app'
    import { showAppNotification } from '@lib/notifications'
    import { participationAction } from '@lib/participation/stores'
    import { Platform } from '@lib/platform'
    import { activeProfile, updateProfile, getAccountColor } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import {
        isSyncing,
        isTransferring,
        selectedAccountStore,
        selectedMessage,
        setSelectedAccount,
        wallet,
    } from '@lib/wallet'

    export let accounts: WalletAccount[] = []
    export let handleCreateAccountPress = (): void => {}
    export let onAccountSelection = (): void => {}

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const hidden = hiddenAccounts.includes($selectedAccountStore?.id)
    const canDelete =
        $selectedAccountStore?.index === accounts.length - 1 &&
        $selectedAccountStore?.rawIotaBalance === 0 &&
        $selectedAccountStore?.messages.length === 0

    const isSelectedAccount = (accountId) => accountId !== $selectedAccountStore?.id
    const { balanceOverview } = $wallet

    let toggleEdit = false

    // TODO: find a better solution to avoid a crash when the action sheet is called again
    // before the last call is finished.
    let isActionSheetCalled = false

    const menuActions = [
        {
            title: localize('actions.customizeAcount'),
            action: handleCustomiseAccountClick,
            style: 'DEFAULT',
        },
        {
            title: localize('actions.viewAddressHistory'),
            action: handleViewAddressHistoryClick,
            style: 'DEFAULT',
        },
        // ToDo: Has to be enabled again, when the export works
        // {
        //     title: localize('actions.exportTransactionHistory'),
        //     action: handleExportTransactionHistoryClick,
        //     style: 'DEFAULT',
        // },
        {
            title: localize(
                canDelete ? 'actions.deleteAccount' : hidden ? 'actions.showAccount' : 'actions.hideAccount'
            ),
            action: () =>
                canDelete ? handleDeleteAccountClick() : hidden ? handleShowAccountClick() : handleHideAccountClick(),
            style: canDelete ? 'DESTRUCTIVE' : 'DEFAULT',
        },
    ]

    async function handleMenuClick() {
        if ($mobile === false) {
            $accountRouter.goTo(AccountRoute.Actions)
            return
        }

        if (isActionSheetCalled) {
            return
        }

        isActionSheetCalled = true

        const index = await Platform.showActionSheet({
            title: localize('general.walletActions'),
            options: [
                ...menuActions.map((action) => ({
                    title: action.title,
                    style: action.style as 'DESTRUCTIVE' | 'DEFAULT',
                })),
                { title: 'Cancel', style: 'CANCEL' },
            ],
        })

        isActionSheetCalled = false
        menuActions[index].action()
    }

    function handleCustomiseAccountClick() {
        $accountRouter.goTo(AccountRoute.Manage)
    }

    function handleViewAddressHistoryClick() {
        $accountRouter.goTo(AccountRoute.AddressHistory)
    }

    function handleExportTransactionHistoryClick() {
        $accountRouter.goTo(AccountRoute.ExportTransactionHistory)
    }

    function handleDeleteAccountClick() {
        $accountRouter.goTo(AccountRoute.DeleteAccount)
    }

    function handleHideAccountClick() {
        $accountRouter.goTo(AccountRoute.HideAccount)
    }

    function handleShowAccountClick() {
        const idx = hiddenAccounts.indexOf($selectedAccountStore?.id)
        if (idx >= 0) {
            hiddenAccounts.splice(idx, 1)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        // TODO: handle for single wallet view
        selectedMessage.set(null)
        resetWalletRoute()
    }

    function handleAccountClick(accountId: string): void {
        if ($isSyncing) {
            showWarning(localize('notifications.syncing'))
        } else if ($isTransferring) {
            showWarning(localize('notifications.transferring'))
        } else if ($participationAction) {
            showWarning(localize('notifications.participating'))
        } else {
            setSelectedAccount(accountId)
            resetAccountRouter(false)
            onAccountSelection()
        }
    }

    function showWarning(message: string): void {
        showAppNotification({
            type: 'warning',
            message,
        })
    }

    function handleCreateAccountClick(): void {
        handleCreateAccountPress()
    }
</script>

<div class="mb-4 -mt-1 flex w-full justify-center">
    <Text type="h4">{localize('general.switchWallet')}</Text>
    <button class="fixed right-5 pr-5" on:click={() => (toggleEdit = !toggleEdit)}>
        <Text type="h5" overrideColor classes="text-blue-500 pt-1">
            {toggleEdit ? localize('actions.cancel') : localize('actions.edit')}
        </Text>
    </button>
</div>
<div class="accounts flex flex-col space-y-1 overflow-auto mb-5">
    {#each accounts as account}
        <div class="flex w-full justify-between space-y-3">
            <button
                on:click={() => handleAccountClick(account.id)}
                class="hover:bg-gray-50 dark:hover:bg-gray-800 flex-1 flex flex-row items-center space-x-4 p-4 pl-3 rounded"
            >
                <div class="circle" style="--account-color: {getAccountColor(account.id)};" />
                <Text classes={isSelectedAccount(account.id) ? 'opacity-50' : ''} type="h5">
                    {account.alias}
                </Text>
            </button>
            {#if toggleEdit}
                <button
                    class="{isSelectedAccount(account.id)
                        ? 'opacity-50 dark:text-white'
                        : 'text-blue-500'} pr-4 py-3 flex flex-row space-x-1 "
                    on:click={() => handleMenuClick()}
                    disabled={isSelectedAccount(account.id)}
                >
                    {#each Array(3) as _}
                        <svg width="4" height="4" viewBox="0 0 4 4">
                            <circle cx="2" cy="2" r="2" class="fill-current" />
                        </svg>
                    {/each}
                </button>
            {:else}
                <Text classes="{isSelectedAccount(account.id) ? 'opacity-50' : ''} mt-1 pr-4" type="h5">
                    {account.balance}
                </Text>
            {/if}
        </div>
    {/each}
</div>
<HR />
<div class="accounts flex flex-col space-y-1 overflow-auto mb-2">
    <div class="flex w-full justify-between space-y-3">
        <button
            class="flex flex-row pr-6 hover:bg-gray-50 dark:hover:bg-gray-800 items-center space-x-2 px-3 pt-6"
            on:click={handleCreateAccountClick}
        >
            <Icon icon="plus" height="16" width="16" classes="text-blue-500" />
            <Text highlighted type="h5">{localize('general.createNewWallet')}</Text>
        </button>
        <Text classes="pr-4 pt-3 opacity-50" type="h5">
            {localize('general.total', { values: { balance: $balanceOverview.balance } })}
        </Text>
    </div>
</div>

<style type="text/scss">
    button {
        .circle {
            @apply relative;
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
            &:after {
                @apply absolute;
                @apply rounded-full;
                @apply w-3;
                @apply h-3;
                @apply border;
                @apply border-solid;
                @apply border-gray-700;
                @apply bg-transparent;
                @apply opacity-10;
                @apply top-1/2;
                @apply left-1/2;
                @apply transform;
                @apply -translate-x-1/2;
                @apply -translate-y-1/2;
                content: '';
            }
        }
    }
</style>

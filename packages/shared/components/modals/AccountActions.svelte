<script lang="typescript">
    import { getContext } from 'svelte'
    import { get, Readable } from 'svelte/store'
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { accountRouter, resetWalletRoute } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { asyncRemoveWalletAccount, setSelectedAccount, selectedAccountStore, wallet } from 'shared/lib/wallet'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { SettingsIcons } from 'shared/lib/typings/icons'

    export let modal: Modal

    const { accounts } = $wallet

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const hidden = hiddenAccounts.includes($selectedAccountStore?.id)
    const canDelete =
        $selectedAccountStore.index === $accounts.length - 1 &&
        $selectedAccountStore.rawIotaBalance === 0 &&
        $selectedAccountStore.messages.length === 0

    const handleCustomiseAccountClick = () => {
        $accountRouter.goTo(AccountRoute.Manage)
        modal.close()
    }

    const handleViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory', props: { account: selectedAccountStore } })
        modal.close()
    }

    function handleExportTransactionHistoryClick() {
        openPopup({ type: 'exportTransactionHistory', props: { account: selectedAccountStore }, hideClose: false })
        modal.close()
    }

    const handleHideAccountClick = () => {
        openPopup({
            type: 'hideAccount',
            props: {
                account: selectedAccountStore,
                hasMultipleAccounts: $viewableAccounts.length > 1,
                hideAccount: (id: string) => {
                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    resetWalletRoute()
                    const nextSelectedAccount =
                        $viewableAccounts[$selectedAccountStore?.index] ??
                        $viewableAccounts[$viewableAccounts.length - 1]
                    setSelectedAccount(nextSelectedAccount?.id)
                },
            },
        })
        modal.close()
    }

    const handleDeleteAccountClick = () => {
        openPopup({
            type: 'deleteAccount',
            props: {
                account: selectedAccountStore,
                hasMultipleAccounts: $viewableAccounts.length > 1,
                deleteAccount: async (id: string) => {
                    await asyncRemoveWalletAccount(get(selectedAccountStore).id)

                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    setSelectedAccount(get(viewableAccounts)?.[0]?.id ?? null)
                    resetWalletRoute()
                },
            },
        })
        modal.close()
    }

    const handleShowAccountClick = () => {
        const idx = hiddenAccounts.indexOf($selectedAccountStore?.id)
        if (idx >= 0) {
            hiddenAccounts.splice(idx, 1)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        resetWalletRoute()
    }
</script>

<Modal bind:this={modal} position={{ top: '100px', right: 'calc((100% + 24px) * 0.6666666)' }}>
    <div class="flex flex-col">
        <!-- Customize -->
        <button
            on:click={() => handleCustomiseAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full {hidden
                ? 'opacity-50 pointer-events-none'
                : ''}"
            disabled={hidden}
        >
            <Icon icon="customize" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('actions.customizeAcount')}</Text>
        </button>
        <!-- Address history -->
        <button
            on:click={() => handleViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('actions.viewAddressHistory')}</Text>
        </button>
        <button
            on:click={handleExportTransactionHistoryClick}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={SettingsIcons.transactionHistory} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('actions.exportTransactionHistory')}</Text>
        </button>
        <HR />
        <!-- Delete -->
        <button
            on:click={() =>
                canDelete ? handleDeleteAccountClick() : hidden ? handleShowAccountClick() : handleHideAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-red-50 dark:hover:bg-red-200 dark:hover:bg-opacity-20 py-4 px-3 w-full"
        >
            <Icon icon={canDelete ? 'delete' : hidden ? 'view' : 'hide'} classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>
                {localize(canDelete ? 'actions.deleteAccount' : hidden ? 'actions.showAccount' : 'actions.hideAccount')}
            </Text>
        </button>
    </div>
</Modal>

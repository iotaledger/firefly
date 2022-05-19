<script lang="typescript">
    import { selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import {
        activeProfile,
        activeAccounts,
        updateActiveAccountMetadata,
        updateActiveProfile,
        visibleActiveAccounts,
    } from '@core/profile'
    import { resetWalletRoute } from '@core/router'
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { asyncRemoveWalletAccount } from 'shared/lib/wallet'

    export let modal: Modal

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const hidden = hiddenAccounts.includes($selectedAccount?.id)
    const canDelete =
        $selectedAccount.meta.index === $activeAccounts?.length - 1 &&
        Number($selectedAccount?.balances.total) === 0 &&
        $selectedAccount.messages?.length === 0

    const handleCustomiseAccountClick = () => {
        openPopup({
            type: 'manageAccount',
        })
        modal.close()
    }

    function handleExportTransactionHistoryClick() {
        openPopup({ type: 'exportTransactionHistory', props: { account: selectedAccount }, hideClose: false })
        modal.close()
    }

    const handleHideAccountClick = () => {
        openPopup({
            type: 'hideAccount',
            props: {
                account: selectedAccount,
                hasMultipleAccounts: $visibleActiveAccounts?.length > 1,
                hideAccount: (id: string) => {
                    updateActiveAccountMetadata(id, { hidden: true })
                    resetWalletRoute()
                    const nextSelectedAccount =
                        $visibleActiveAccounts[$selectedAccount?.meta.index] ??
                        $visibleActiveAccounts[$visibleActiveAccounts?.length - 1]
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
                account: selectedAccount,
                hasMultipleAccounts: $visibleActiveAccounts?.length > 1,
                deleteAccount: async (id: string) => {
                    await asyncRemoveWalletAccount($selectedAccount?.id)

                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateActiveProfile({ hiddenAccounts: hiddenAccounts })
                    }
                    setSelectedAccount($visibleActiveAccounts?.[0]?.id ?? null)
                    resetWalletRoute()
                },
            },
        })
        modal.close()
    }

    const handleShowAccountClick = () => {
        updateActiveAccountMetadata($selectedAccount.id, { hidden: false })
        resetWalletRoute()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        <button
            on:click={handleExportTransactionHistoryClick}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={SettingsIcons.transactionHistory} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('actions.exportTransactionHistory')}</Text>
        </button>
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
        <button
            on:click={() => (hidden ? handleShowAccountClick() : handleHideAccountClick())}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={hidden ? 'view' : 'hide'} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500"
                >{localize(hidden ? 'actions.showAccount' : 'actions.hideAccount')}</Text
            >
        </button>
        <HR />
        <button
            on:click={handleDeleteAccountClick}
            disabled
            class="group flex flex-row justify-start items-center hover:bg-red-50 dark:hover:bg-red-200 dark:hover:bg-opacity-20 py-4 px-3 w-full"
        >
            <Icon icon={'delete'} classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>
                {localize('actions.deleteAccount')}
            </Text>
        </button>
    </div>
</Modal>

<script lang="typescript">
    import { getContext } from 'svelte'
    import { get, Readable } from 'svelte/store'
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { accountRouter, AccountRoute, resetWalletRoute } from '@core/router'
    import { asyncRemoveWalletAccount, selectedAccountId } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { SettingsIcons } from 'shared/lib/typings/icons'

    export let locale: Locale

    export let isActive

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const allAccounts = getContext<Readable<WalletAccount[]>>('walletAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const hidden = hiddenAccounts.includes($selectedAccountId)
    const canDelete =
        $account.index === $allAccounts.length - 1 && $account.rawIotaBalance === 0 && $account.messages.length === 0

    const handleCustomiseAccountClick = () => {
        $accountRouter.goTo(AccountRoute.Manage)
        isActive = false
    }

    const handleViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory', props: { account } })
        isActive = false
    }

    function handleExportTransactionHistoryClick() {
        openPopup({ type: 'exportTransactionHistory', props: { account }, hideClose: false })
        isActive = false
    }

    const handleHideAccountClick = () => {
        openPopup({
            type: 'hideAccount',
            props: {
                account,
                hasMultipleAccounts: $viewableAccounts.length > 1,
                hideAccount: (id: string) => {
                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    resetWalletRoute()
                },
            },
        })
        isActive = false
    }

    const handleDeleteAccountClick = () => {
        openPopup({
            type: 'deleteAccount',
            props: {
                account,
                hasMultipleAccounts: $viewableAccounts.length > 1,
                deleteAccount: async (id: string) => {
                    await asyncRemoveWalletAccount(get(account).id)

                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    resetWalletRoute()
                },
            },
        })
        isActive = false
    }

    const handleShowAccountClick = () => {
        const idx = hiddenAccounts.indexOf($selectedAccountId)
        if (idx >= 0) {
            hiddenAccounts.splice(idx, 1)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        resetWalletRoute()
    }
</script>

<Modal bind:isActive position={{ top: '121px', right: 'calc((100% + 16px) * 0.6666666)' }}>
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
            <Text smaller classes="group-hover:text-blue-500">{locale('actions.customizeAcount')}</Text>
        </button>
        <!-- Address history -->
        <button
            on:click={() => handleViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('actions.viewAddressHistory')}</Text>
        </button>
        <button
            on:click={handleExportTransactionHistoryClick}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={SettingsIcons.transactionHistory} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('actions.exportTransactionHistory')}</Text>
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
                {locale(canDelete ? 'actions.deleteAccount' : hidden ? 'actions.showAccount' : 'actions.hideAccount')}
            </Text>
        </button>
    </div>
</Modal>

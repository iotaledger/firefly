<script lang="typescript">
    import { HR, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { accountRouter, AccountRoute, resetWalletRoute } from '@core/router'
    import { SettingsIcons } from 'shared/lib/typings/icons'
    import { selectedAccount, selectedMessage, wallet } from 'shared/lib/wallet'

    const { accounts } = $wallet

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const hidden = hiddenAccounts.includes($selectedAccount?.id)
    const canDelete =
        $selectedAccount.index === $accounts.length - 1 &&
        $selectedAccount.rawIotaBalance === 0 &&
        $selectedAccount.messages.length === 0

    const handleCustomiseAccountClick = () => {
        $accountRouter.goTo(AccountRoute.Manage)
    }

    const handleViewAddressHistoryClick = () => {
        $accountRouter.goTo(AccountRoute.AddressHistory)
    }

    function handleExportTransactionHistoryClick() {
        $accountRouter.goTo(AccountRoute.ExportTransactionHistory)
    }

    const handleHideAccountClick = () => {
        $accountRouter.goTo(AccountRoute.HideAccount)
    }

    const handleDeleteAccountClick = () => {
        $accountRouter.goTo(AccountRoute.DeleteAccount)
    }

    const handleShowAccountClick = () => {
        const idx = hiddenAccounts.indexOf($selectedAccount?.id)
        if (idx >= 0) {
            hiddenAccounts.splice(idx, 1)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        // TODO: handle for single wallet view
        selectedMessage.set(null)
        resetWalletRoute()
    }
</script>

<div class="flex flex-col py-10 px-6 w-full">
    <div class="mb-5">
        <Text type="h4">{localize('general.walletActions')}</Text>
    </div>
    <!-- Customize -->
    <button
        on:click={() => handleCustomiseAccountClick()}
        class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 pb-3 w-full {hidden
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
        class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 w-full"
    >
        <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
        <Text smaller classes="group-hover:text-blue-500">{localize('actions.viewAddressHistory')}</Text>
    </button>
    <button
        on:click={handleExportTransactionHistoryClick}
        class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 w-full"
    >
        <Icon icon={SettingsIcons.transactionHistory} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
        <Text smaller classes="group-hover:text-blue-500">{localize('actions.exportTransactionHistory')}</Text>
    </button>
    <HR />
    <!-- Delete -->
    <button
        on:click={() =>
            canDelete ? handleDeleteAccountClick() : hidden ? handleShowAccountClick() : handleHideAccountClick()}
        class="group flex flex-row justify-start items-center hover:bg-red-50 dark:hover:bg-red-200 dark:hover:bg-opacity-20 py-4 w-full"
    >
        <Icon icon={canDelete ? 'delete' : hidden ? 'view' : 'hide'} classes="text-red-500 ml-1 mr-3" />
        <Text smaller classes="text-red-500" overrideColor>
            {localize(canDelete ? 'actions.deleteAccount' : hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        </Text>
    </button>
</div>

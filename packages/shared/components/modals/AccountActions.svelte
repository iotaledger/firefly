<script lang="typescript">
    import { HR, Icon, Modal, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId, selectedMessage, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const allAccounts = getContext<Readable<WalletAccount[]>>('walletAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    export let isActive
    export let locale
    let hidden = hiddenAccounts.includes($selectedAccountId)
    let canDelete = $account.index === $allAccounts.length - 1 && $account.rawIotaBalance === 0 && $account.messages.length === 0

    const handleCustomiseAccountClick = () => {
        accountRoute.set(AccountRoutes.Manage)
        isActive = false
    }

    const handlViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory', wide: true, props: { account } })
        isActive = false
    }
    const handleHideAccountClick = () => {
        openPopup({
            type: 'hideAccount',
            props: {
                account,
                hasMultipleAccounts: $viewableAccounts.length > 1,
                hideAccount: (id) => {
                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    selectedAccountId.set(null)
                    selectedMessage.set(null)
                    walletRoute.set(WalletRoutes.Init)
                    accountRoute.set(AccountRoutes.Init)
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
                deleteAccount: (id) => {
                    if (!hiddenAccounts.includes(id)) {
                        hiddenAccounts.push(id)
                        updateProfile('hiddenAccounts', hiddenAccounts)
                    }
                    selectedAccountId.set(null)
                    selectedMessage.set(null)
                    walletRoute.set(WalletRoutes.Init)
                    accountRoute.set(AccountRoutes.Init)
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
        selectedAccountId.set(null)
        selectedMessage.set(null)
        walletRoute.set(WalletRoutes.Init)
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<Modal bind:isActive position={{ top: '121px', right: 'calc((100% + 16px) * 0.6666666)' }}>
    <div class="flex flex-col">
        <!-- Customize -->
        <button
            on:click={() => handleCustomiseAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full {hidden ? 'opacity-50 pointer-events-none' : ''}"
            disabled={hidden}>
            <Icon icon="customize" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.customizeAcount`)}</Text>
        </button>
        <!-- Address history -->
        <button
            on:click={() => handlViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full">
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.viewAddressHistory`)}</Text>
        </button>
        <HR />
        <!-- Delete -->
        <button
            on:click={() => (canDelete ? handleDeleteAccountClick() : hidden ? handleShowAccountClick() : handleHideAccountClick())}
            class="group flex flex-row justify-start items-center hover:bg-red-50 dark:hover:bg-red-200 dark:hover:bg-opacity-20 py-4 px-3 w-full">
            <Icon icon={canDelete ? 'delete' : hidden ? 'view' : 'hide'} classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>
                {locale(canDelete ? 'actions.deleteAccount' : hidden ? `actions.showAccount` : `actions.hideAccount`)}
            </Text>
        </button>
    </div>
</Modal>

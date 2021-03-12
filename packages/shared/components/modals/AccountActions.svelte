<script lang="typescript">
    import { Icon, Modal, Text, HR } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    export let isActive
    export let locale

    const handleCustomiseAccountClick = () => {
        accountRoute.set(AccountRoutes.Manage)
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
        <!-- Address history -->
        <!-- TODO: Implement and enable -->
        <button
            disabled
            on:click={() => handlViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full opacity-50 pointer-events-none">
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.view_address_history`)}</Text>
        </button>
        <HR />
        <!-- Delete -->
        <button
            on:click={() => handleDeleteAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-red-50 py-4 px-3 w-full">
            <Icon icon="delete" classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>{locale(`actions.delete_account`)}</Text>
        </button>
    </div>
</Modal>

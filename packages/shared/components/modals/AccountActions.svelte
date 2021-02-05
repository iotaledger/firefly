<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, Icon, Modal } from 'shared/components'
    import { accountViewState, AccountViewStates } from 'shared/lib/router'
    import { openPopup } from 'shared/lib/popup'

    const account = getContext('selectedAccount')

    export let isActive
    export let locale

    const handleCustomiseAccountClick = () => {
        accountViewState.set(AccountViewStates.Manage)
        isActive = false
    }
    const handleSyncAccountClick = () => {
        isActive = false
    }
    const handlViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory', props: { account } })
        isActive = false
    }
    const handleDeleteAccountClick = () => {
        openPopup({ type: 'deleteAccount', props: { account } })
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
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon icon="refresh" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.sync_account`)}</Text>
        </button>
        <!-- Address history -->
        <button
            on:click={() => handlViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
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

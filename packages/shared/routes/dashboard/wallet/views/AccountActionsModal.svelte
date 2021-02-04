<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Text, Icon } from 'shared/components'
    import { accountViewState, AccountViewStates } from 'shared/lib/router'
    import { openPopup } from 'shared/lib/popup'

    export let isActive
    export let locale

    const handleCustomiseAccountClick = () => {
        accountViewState.set(AccountViewStates.Manage)
        isActive = false
    }
    const handleSyncAccountClick = () => {
        isActive = false
    }
    const handleViewAddressHistoryClick = () => {
        openPopup({ type: 'addressHistory' })
        isActive = false
    }
    const handleDeleteAccountClick = () => {
        openPopup({ type: 'deleteAccount' })
        isActive = false
    }
</script>

<style type="text/scss">
    account-actions-menu-content {
        position: absolute;
        right: calc((100% + 43px) * 0.6666666);
        top: 121px;
        min-width: 230px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    }
</style>

{#if isActive}
    <account-actions-menu-shield
        class="fixed left-0 top-0 right-0 bottom-0 bg-transparent z-0"
        on:click={() => (isActive = false)} />
    <account-actions-menu-content
        class="flex flex-col bg-white dark:bg-gray-900 border border-solid border-gray-200 rounded-lg overflow-hidden z-10"
        in:fade={{ duration: 100 }}>
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
            on:click={() => handleViewAddressHistoryClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon icon="history" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`actions.view_address_history`)}</Text>
        </button>
        <hr class="border-t border-solid border-gray-200" />
        <!-- Delete -->
        <button
            on:click={() => handleDeleteAccountClick()}
            class="group flex flex-row justify-start items-center hover:bg-red-50 py-4 px-3 w-full">
            <Icon icon="delete" classes="text-red-500 ml-1 mr-3" />
            <Text smaller classes="text-red-500" overrideColor>{locale(`actions.delete_account`)}</Text>
        </button>
    </account-actions-menu-content>
{/if}

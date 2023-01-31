<script lang="ts">
    import { AccountSwitcherModal, Icon, Modal } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { AccountLabel } from 'shared/components/atoms/'

    let modal: Modal
    let isModalOpened: boolean

    function onClick(): void {
        modal?.toggle()
    }
</script>

<svelte:window on:click={() => (isModalOpened = modal?.isOpened())} />
<div class="relative left-8" style="-webkit-app-region: none;">
    <button on:click={onClick} class="flex flex-row justify-center items-center space-x-2">
        <AccountLabel account={$selectedAccount} />
        <div class="transform {isModalOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon height="18" width="18" icon="chevron-down" classes="text-gray-800 dark:text-white" />
        </div>
    </button>
    <AccountSwitcherModal bind:modal />
</div>

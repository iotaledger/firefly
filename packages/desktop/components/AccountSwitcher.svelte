<script lang="ts">
    import { AccountLabel, Icon, Modal } from '@ui'
    import { AccountSwitcherModal } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { Icon as IconEnum } from '@auxiliary/icon'

    let modal: Modal
    let isModalOpened: boolean = false

    function onClick(): void {
        isModalOpened = modal?.isOpened()
    }
</script>

<svelte:window on:click={onClick} />
<account-switcher class="block relative left-8 bg-white dark:bg-gray-800 rounded-lg">
    <button type="button" on:click={modal?.toggle} class="flex flex-row justify-center items-center space-x-2 p-2">
        <AccountLabel account={$selectedAccount} />
        <icon-container class:rotate={isModalOpened}>
            <Icon height="18" width="18" icon={IconEnum.ChevronDown} classes="text-gray-800 dark:text-white" />
        </icon-container>
    </button>
    <AccountSwitcherModal bind:modal />
</account-switcher>

<style lang="scss">
    account-switcher {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
        -webkit-app-region: none;
    }

    icon-container {
        @apply block transform rotate-0;

        &.rotate {
            @apply rotate-180;
        }
    }
</style>

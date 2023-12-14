<script lang="ts">
    import { WalletLabel, Icon, Modal } from '@ui'
    import { WalletSwitcherModal } from '@components'
    import { selectedWallet } from '@core/wallet/stores'
    import { Icon as IconEnum } from '@auxiliary/icon'

    let modal: Modal
    let isModalOpened: boolean = false

    function onOutsideClick(): void {
        isModalOpened = modal?.isOpened()
    }

    function onButtonClick(): void {
        modal?.toggle()
    }
</script>

<svelte:window on:click={onOutsideClick} />
<account-switcher>
    <button type="button" on:click={onButtonClick} class="flex flex-row justify-center items-center space-x-2">
        <WalletLabel wallet={$selectedWallet} />
        <icon-container class:rotate={isModalOpened}>
            <Icon height="18" width="18" icon={IconEnum.ChevronDown} classes="text-gray-800 dark:text-white" />
        </icon-container>
    </button>
    <WalletSwitcherModal bind:modal />
</account-switcher>

<style lang="scss">
    account-switcher {
        @apply block relative;
        -webkit-app-region: none;
    }

    icon-container {
        @apply block transform rotate-0;

        &.rotate {
            @apply rotate-180;
        }
    }
</style>

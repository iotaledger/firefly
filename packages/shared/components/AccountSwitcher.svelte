<script lang="typescript">
    import type { WalletAccount } from 'lib/typings/wallet'
    import { AccountSwitcherModal, Icon, Text } from 'shared/components'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}

    let showModal: boolean = false

    function toggleModal() {
        showModal = !showModal
    }
</script>

<button on:click={toggleModal} class="flex flex-row justify-center items-center space-x-4">
    <div class="circle" style="--account-color: {getColor($activeProfile, $selectedAccount?.id)};" />
    <Text type="h4">{$selectedAccount?.alias}</Text>
    <div class="transform transition-all {showModal ? 'rotate-180' : 'rotate-0'}">
        <Icon icon="chevron-down" classes="text-gray-800 dark:text-white" />
    </div>
</button>
<AccountSwitcherModal {onCreateAccount} {accounts} bind:isActive={showModal} />

<style type="text/scss">
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>

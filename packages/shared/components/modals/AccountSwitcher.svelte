<script lang="typescript">
    import { Modal, AccountSwitcher } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import type { WalletAccount } from 'shared/lib/typings/wallet'

    export let isActive = false
    export let accounts: WalletAccount[] = []
    export let onAccountCreation = (..._: any[]): void => {}

    const handleCreateAccountPress = (): void => {
        isActive = false
        openPopup({ type: 'accountCreation', props: { onAccountCreation } })
    }
</script>

<Modal bind:isActive classes="transform -translate-x-1/2" size="large" position={{ top: '32px', left: '50%' }}>
    <AccountSwitcher {handleCreateAccountPress} {accounts} />
</Modal>

<style type="text/scss">
    .accounts {
        max-height: 40vh;
    }
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>

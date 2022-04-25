<script lang="typescript">
    import { AccountSwitcherModal, Icon, Text, Modal } from 'shared/components'
    import { activeProfile, getColor, updateProfile } from '@lib/profile'
    import { selectedAccount } from '@lib/wallet'
    import { WalletAccount } from '@lib/typings/wallet'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}

    let modal: Modal
    let isModalOpened: boolean

    let lastSelectedAccount: WalletAccount = null
    $: if ($selectedAccount) lastSelectedAccount = $selectedAccount

    function onClick() {
        modal?.toggle()
        updateProfile('hasFinishedSingleAccountGuide', true)
    }
</script>

<svelte:window on:click={() => (isModalOpened = modal?.isOpened())} />
<div class="relative left-8" style="-webkit-app-region: none;">
    <button on:click={onClick} class="flex flex-row justify-center items-center space-x-2">
        <div class="circle" style="--account-color: {getColor($activeProfile, lastSelectedAccount?.id)};" />
        <Text type="h5">{lastSelectedAccount?.alias ?? '---'}</Text>
        <div class="transform {isModalOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon height="18" width="18" icon="chevron-down" classes="text-gray-800 dark:text-white" />
        </div>
    </button>
    <AccountSwitcherModal {onCreateAccount} {accounts} bind:modal />
</div>

<style type="text/scss">
    button {
        .circle {
            @apply relative;
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
            &:after {
                @apply absolute;
                @apply rounded-full;
                @apply w-3;
                @apply h-3;
                @apply border;
                @apply border-solid;
                @apply border-gray-700;
                @apply bg-transparent;
                @apply opacity-10;
                @apply top-1/2;
                @apply left-1/2;
                @apply transform;
                @apply -translate-x-1/2;
                @apply -translate-y-1/2;
                content: '';
            }
        }
    }
</style>

<script lang="typescript">
    import { AccountSwitcher } from 'shared/components'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let onCreateAccount = (..._: any[]): void => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
</script>

<div
    class="bg-gray-20 dark:bg-gray-800 border-solid border-b border-gray-300 dark:border-gray-700 flex flex-row justify-center py-2 w-full"
>
    <!-- <button data-label="back-button" class="flex-1 mt-1" on:click={() => {}}>
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-blue-500" />
            <Text type="h5">{localize('actions.back')}</Text>
        </div>
    </button> -->
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>

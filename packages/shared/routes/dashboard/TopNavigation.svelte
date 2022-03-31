<script lang="typescript">
    import { AccountSwitcher } from 'shared/components'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let onCreateAccount = (..._: any[]): void => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
</script>

<div
    class="bg-gray-200 dark:bg-gray-800 border-solid border-b border-gray-300 dark:border-gray-700 flex flex-row justify-center py-2 w-full"
>
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>

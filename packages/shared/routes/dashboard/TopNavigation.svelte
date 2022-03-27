<script lang="typescript">
    import { AccountNavigation } from 'shared/components'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { mobile } from 'shared/lib/app'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'

    export let onAccountCreation = (..._: any[]): void => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    $: color = getColor($activeProfile, $selectedAccount?.id) as string
</script>

<div
    style="--account-color: {color};"
    class="{$mobile
        ? 'account-color top-navigation h-20 items-center'
        : 'bg-gray-200 border-solid border-b border-gray-300 py-2'} dark:bg-gray-800 dark:border-gray-700 flex flex-row justify-center w-full"
>
    <AccountNavigation {onAccountCreation} accounts={$viewableAccounts} />
</div>

<style type="text/scss">
    .account-color {
        background-color: var(--account-color);
    }
    .top-navigation {
        padding-top: calc(env(safe-area-inset-top));
    }
</style>

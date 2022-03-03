<script lang="typescript">
    import { getContext } from 'svelte'
    import { localize } from 'shared/lib/i18n';
    import { AccountSwitcher, Icon, Text } from 'shared/components'
    import type { Readable } from 'svelte/store'
    import type { WalletAccount } from 'shared/lib/typings/wallet'

    export let onCreateAccount = (..._: any[]): void => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
</script>

<div
    class="bg-gray-200 dark:bg-gray-800 border-solid border-b border-gray-300 dark:border-gray-700 flex flex-row justify-center py-2 w-full"
>
    <button on:click={() => console.log('back')} class="absolute left-6">
        <div class="flex items-center space-x-3">
            <Icon icon="arrow-left" classes="text-gray-500" />
            <Text bigger overrideColor classes="text-gray-500">{localize('actions.back')}</Text>
        </div>
    </button>
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>

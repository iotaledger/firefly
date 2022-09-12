<script lang="typescript">
    import { Modal, RecipientAccountSelector, AccountLabel } from 'shared/components'
    import { IAccountState, selectedAccount } from '@core/account'

    export let account: IAccountState = $selectedAccount

    let modal: Modal
</script>

<account-input class="w-full h-full relative">
    <button
        on:click={() => modal?.open()}
        class="w-full flex flex-row flex-1 justify-between px-4 py-3 rounded-lg border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600"
    >
        <AccountLabel {account} />
    </button>
    <RecipientAccountSelector bind:modal bind:selected={account} showBalance includeSelectedAccount />
</account-input>

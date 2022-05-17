<script lang="typescript">
    import { truncateString } from 'shared/lib/helpers'
    import { activeProfile } from '@core/profile'
    import { IAccountState, selectedAccount } from '@core/account'
    import { Modal, AccountLabel, Text } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let modal: Modal
    export let searchValue: string
    export let selected: IAccountState

    const { accounts } = $activeProfile

    $: otherAccounts = $accounts.filter((account) => account.id !== $selectedAccount.id)
    $: filteredAccounts = otherAccounts.filter(
        (account) =>
            account
                .getAlias()
                .toLowerCase()
                .includes(searchValue?.toLowerCase() ?? '') ||
            account.depositAddress.toLowerCase().includes(searchValue?.toLowerCase() ?? '')
    )
    $: scrollable = filteredAccounts.length > 5

    function onClick(_selected: IAccountState): void {
        modal?.close()
        selected = _selected
    }
</script>

{#if filteredAccounts.length > 0}
    <Modal
        bind:this={modal}
        position={{ left: '24px', right: scrollable ? '32px' : '24px' }}
        classes="max-h-64 overflow-auto scrollable-y"
    >
        <recipient-account-picker-modal
            class="flex flex-col space-y-1 p-2 {scrollable ? 'pr-0' : ''}"
            in:fade={{ duration: 100 }}
        >
            {#each filteredAccounts as account}
                <button
                    on:click={() => onClick(account)}
                    class="w-full flex flex-row flex-1 justify-between p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <AccountLabel profile={$activeProfile} {account} />
                    <Text type="pre" fontSize="sm" color="gray-600"
                        >{truncateString(account?.depositAddress, 10, 10)}</Text
                    >
                </button>
            {/each}
        </recipient-account-picker-modal>
    </Modal>
{/if}

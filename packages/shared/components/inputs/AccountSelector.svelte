<script lang="ts">
    import { Modal, AccountLabel, Text, TextType } from 'shared/components'
    import { IAccountState, selectedAccount } from '@core/account'
    import { fade } from 'svelte/transition'
    import { visibleActiveAccounts, getBaseToken } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    export let hideSelectedAccount: boolean = false

    let modal: Modal | undefined
    let account = $selectedAccount

    $: accounts = $visibleActiveAccounts?.filter(
        (account) => account.index !== $selectedAccount?.index || !hideSelectedAccount
    )

    function getSuffixForAccount(account: IAccountState): string {
        return formatTokenAmountBestMatch(Number(account.balances.baseCoin.available), getBaseToken())
    }

    function onClick(_selected: IAccountState): void {
        modal?.close()
        account = _selected
    }

    function handleFilteredAccountClick(account: IAccountState): () => void {
        return () => onClick(account)
    }
</script>

<account-input class="w-full h-full relative">
    <button
        on:click={modal?.open}
        class="w-full flex flex-row flex-1 justify-between px-4 py-3 rounded-lg border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600"
    >
        <AccountLabel {account} />
    </button>

    {#if accounts?.length > 0}
        <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4">
            <recipient-account-picker-modal
                class="max-h-64 flex flex-col space-y-1 scrollable-y"
                in:fade={{ duration: 100 }}
            >
                {#each accounts as account}
                    {@const handleOnClick = handleFilteredAccountClick(account)}
                    <button
                        on:click={handleOnClick}
                        class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                    >
                        <AccountLabel {account} />
                        <Text type={TextType.pre} fontSize="sm" color="gray-600">{getSuffixForAccount(account)}</Text>
                    </button>
                {/each}
            </recipient-account-picker-modal>
        </Modal>
    {/if}
</account-input>

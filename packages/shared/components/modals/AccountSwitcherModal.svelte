<script lang="typescript">
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, visibleActiveAccounts } from '@core/profile'
    import { IAccountState } from '@core/account'
    import { formatBestMatchTokenAmount } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { AccountSwitcherMenuItem } from 'shared/components/molecules'
    import { HR, Icon, Modal, Text } from 'shared/components'

    export let modal: Modal

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    function sumBalanceForAccounts(accounts: IAccountState[]): number {
        return accounts.reduce((acc, account) => (acc += Number(account.balances.total)), 0)
    }

    function handleCreateAccountClick(): void {
        modal?.close()
        openPopup({ type: 'createAccount' })
    }
</script>

<Modal bind:this={modal} classes="transform -translate-x-1/2" size="large" position={{ top: '30px', left: '50%' }}>
    <div class="p-4">
        <div class="accounts flex flex-col space-y-1 max-h-96 scrollable-y">
            {#each $visibleActiveAccounts as account}
                <AccountSwitcherMenuItem {account} onClick={() => modal?.close()} />
            {/each}
        </div>
    </div>
    <HR />
    <button
        class="w-full hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-8"
        on:click={handleCreateAccountClick}
    >
        <div class="flex flex-row items-center space-x-4">
            <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
            <Text highlighted type="h5" classes="text-14">{localize('general.addAWallet')}</Text>
        </div>
        <Text classes="opacity-50" type="h5">
            {localize('general.total', {
                values: {
                    balance: formatBestMatchTokenAmount(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol]),
                },
            })}
        </Text>
    </button>
</Modal>

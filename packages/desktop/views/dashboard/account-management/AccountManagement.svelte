<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'
    import { OutputData } from '@iota/sdk/out/types'

    const allAccounts: OutputData[] = [...$selectedWallet.accountOutputs, ...$selectedWallet.implicitAccountOutputs]

    let selectedAccount: OutputData = allAccounts[0]

    function handleAccountClick(account: OutputData): void {
        selectedAccount = account
    }

    function setAccountIndex(account: OutputData): number {
        return allAccounts.indexOf(account) + 1
    }
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedWallet?.id}
                {#if features.accountManagement.accountList.enabled}
                    <AccountManagementList onAccountClick={handleAccountClick} />
                {/if}
                {#if features.accountManagement.accountDetails.enabled}
                    <AccountManagementDetails {selectedAccount} index={setAccountIndex(selectedAccount)} />
                {/if}
            {/key}
        </div>
    </account-management-container>
{/if}

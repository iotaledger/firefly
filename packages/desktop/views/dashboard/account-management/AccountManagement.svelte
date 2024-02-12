<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import { OutputData } from '@iota/sdk/out/types'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'

    const implicitAccounts: OutputData[] = $selectedWallet.implicitAccountOutputs
    const accounts: OutputData[] = $selectedWallet.accountOutputs
    const allAccounts: OutputData[] = [...accounts, ...implicitAccounts]
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedWallet?.id}
                {#if features.accountManagement.accountList.enabled}
                    <AccountManagementList {allAccounts} {accounts} {implicitAccounts} />
                {/if}
                {#if features.accountManagement.accountDetails.enabled}
                    <AccountManagementDetails />
                {/if}
            {/key}
        </div>
    </account-management-container>
{/if}

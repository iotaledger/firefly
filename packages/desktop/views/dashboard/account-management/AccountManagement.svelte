<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedWallet?.id}
                {#if features.accountManagement.accountList.enabled}
                    <AccountManagementList />
                {/if}
                {#if features.accountManagement.accountDetails.enabled}
                    <AccountManagementDetails />
                {/if}
            {/key}
        </div>
    </account-management-container>
{/if}

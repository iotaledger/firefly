<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'
    import { AccountOutput, OutputData } from '@iota/sdk/out/types'

    let selectedOutput =
        $selectedWallet?.accountOutputs.find(
            (output) => (output.output as AccountOutput)?.accountId === $selectedWallet?.mainAccountId
        ) ||
        $selectedWallet?.accountOutputs?.[0] ||
        $selectedWallet?.implicitAccountOutputs?.[0]

    function handleAccountClick(account: OutputData): void {
        selectedOutput = account
    }
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedWallet?.id}
                {#if features.accountManagement.accountList.enabled}
                    <AccountManagementList onAccountClick={handleAccountClick} {selectedOutput} />
                {/if}
                {#if features.accountManagement.accountDetails.enabled}
                    <AccountManagementDetails {selectedOutput} />
                {/if}
            {/key}
        </div>
    </account-management-container>
{/if}

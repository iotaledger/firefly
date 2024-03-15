<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'
    import { AccountOutput, OutputData } from '@iota/sdk/out/types'
    import { isAccountOutput, isImplicitAccountOutput } from '@core/wallet'

    $: allAccountOutputs =
        $selectedWallet?.walletUnspentOutputs?.filter(
            (output) => isAccountOutput(output) || isImplicitAccountOutput(output)
        ) || []

    let selectedOutput =
        $selectedWallet?.walletUnspentOutputs?.find(
            (output) => (output.output as AccountOutput)?.accountId === $selectedWallet.mainAccountId
        ) || allAccountOutputs?.[0]

    function handleAccountClick(account: OutputData): void {
        selectedOutput = account
    }

    function setAccountOutputIndex(account: OutputData): number {
        return allAccountOutputs.indexOf(account) + 1
    }
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        {#if selectedOutput}
            <div class="flex space-x-4 max-w-7xl justify-center w-full">
                {#key $selectedWallet?.id}
                    {#if features.accountManagement.accountList.enabled}
                        <AccountManagementList
                            onAccountClick={handleAccountClick}
                            allOutputs={allAccountOutputs}
                            {selectedOutput}
                        />
                    {/if}
                    {#if features.accountManagement.accountDetails.enabled}
                        <AccountManagementDetails {selectedOutput} index={setAccountOutputIndex(selectedOutput)} />
                    {/if}
                {/key}
            </div>
        {/if}
    </account-management-container>
{/if}

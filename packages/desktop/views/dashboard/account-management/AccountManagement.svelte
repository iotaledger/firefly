<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
    import { AccountManagementDetails, AccountManagementList } from '@components'
    import { AccountOutput, OutputData } from '@iota/sdk/out/types'
    import { isAccountOutput, isImplicitAccountOutput } from '@core/wallet'
    import { Text } from '@ui'
    import { localize } from '@core/i18n'

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
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#if selectedOutput}
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
            {:else}
                <div class="flex flex-col w-full h-full justify-center items-center">
                    <Text secondary>{localize('views.accountManagement.emptyAccounts')}</Text>
                </div>
            {/if}
        </div>
    </account-management-container>
{/if}

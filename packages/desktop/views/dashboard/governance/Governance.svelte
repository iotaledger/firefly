<script lang="typescript">
    import { Pane, ProposalsDetails, VotingPower } from '@ui'
    import { selectedAccount } from '@core/account'
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <div class="w-1/3 flex flex-col space-y-4">
                <Pane classes="p-6 h-fit">
                    <VotingPower />
                </Pane>
                <Pane classes="p-6 h-fit">
                    <ProposalsDetails />
                </Pane>
            </div>
        {/key}
    </div>
{/if}

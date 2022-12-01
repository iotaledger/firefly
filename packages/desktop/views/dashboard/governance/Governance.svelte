<script lang="typescript">
    import { Pane, VotingPower } from '@ui'
    import { selectedAccount } from '@core/account'
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <Pane classes="w-1/3 p-6 h-fit">
                <VotingPower />
            </Pane>
        {/key}
    </div>
{/if}

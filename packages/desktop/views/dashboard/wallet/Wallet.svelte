<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import features from '@features/features'
    import { ReceiveAddressButton } from 'shared/components/atoms'
    import { AccountActivity, SendButton } from '@components'
    import { AccountAssetsList, AccountSummary, Pane } from '@ui'
</script>

{#if $selectedAccount}
    <div
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <div class="flex flex-col space-y-4">
                    <Pane overflow="visible" classes="flex-none">
                        {#if features?.wallet?.accountSummary?.enabled}
                            <AccountSummary />
                        {/if}
                    </Pane>
                    <Pane classes="flex flex-col p-6 space-y-6">
                        {#if features?.wallet?.sendAndReceive?.enabled}
                            <SendButton />
                            <ReceiveAddressButton />
                        {/if}
                    </Pane>
                </div>
                <Pane classes="h-full">
                    {#if features?.wallet?.assets?.enabled}
                        <AccountAssetsList />
                    {/if}
                </Pane>
                <Pane classes="h-full">
                    {#if features?.wallet?.activityHistory?.enabled}
                        <AccountActivity />
                    {/if}
                </Pane>
            </div>
        {/key}
    </div>
{/if}

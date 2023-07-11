<script lang="ts">
    import { AssetList, Overflow, Pane, ReceiveAddressButton } from '@ui'
    import { AccountSummary, AccountActivity, SendButton } from '@components'
    import { selectedAccountAssets } from '@core/wallet'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <div class="flex flex-col space-y-4">
                    <div class="flex-none">
                        <Pane overflow={Overflow.Visible}>
                            {#if features?.wallet?.accountSummary?.enabled}
                                <AccountSummary />
                            {/if}
                        </Pane>
                    </div>
                    <Pane>
                        <div class="flex flex-col space-y-6">
                            {#if features?.wallet?.sendAndReceive?.enabled}
                                <SendButton />
                                <ReceiveAddressButton />
                            {/if}
                        </div>
                    </Pane>
                </div>
                <Pane>
                    {#if features?.wallet?.assets?.enabled}
                        <AssetList assets={$selectedAccountAssets} />
                    {/if}
                </Pane>
                <Pane>
                    {#if features?.wallet?.activityHistory?.enabled}
                        <AccountActivity />
                    {/if}
                </Pane>
            </div>
        {/key}
    </wallet-container>
{/if}

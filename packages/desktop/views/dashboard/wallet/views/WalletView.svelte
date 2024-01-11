<script lang="ts">
    import { AssetList, Overflow, Pane, ReceiveAddressButton } from '@ui'
    import { AccountSummary, AccountActivity, SendButton } from '@components'
    import { selectedWalletAssets } from '@core/wallet'
    import { selectedWallet } from '@core/wallet/stores'
    import features from '@features/features'
</script>

{#if $selectedWallet}
    {#key $selectedWallet?.index}
        <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
            <div class="flex flex-col space-y-4">
                <Pane overflow={Overflow.Visible}>
                    {#if features?.wallet?.accountSummary?.enabled}
                        <AccountSummary />
                    {/if}
                </Pane>
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
                    <AssetList assets={$selectedWalletAssets} />
                {/if}
            </Pane>
            <Pane>
                {#if features?.wallet?.activityHistory?.enabled}
                    <AccountActivity />
                {/if}
            </Pane>
        </div>
    {/key}
{/if}

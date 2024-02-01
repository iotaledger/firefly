<script lang="ts">
    import { AssetList, Overflow, Pane, ReceiveAddressButton } from '@ui'
    import { WalletSummary, WalletActivity, SendButton } from '@components'
    import { selectedWalletAssets } from '@core/wallet'
    import features from '@features/features'
</script>

<wallet-container
    class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center"
>
    <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
        <div class="flex flex-col space-y-4">
            <Pane overflow={Overflow.Visible}>
                {#if features?.wallet?.walletSummary?.enabled}
                    <WalletSummary />
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
                <WalletActivity />
            {/if}
        </Pane>
    </div>
</wallet-container>

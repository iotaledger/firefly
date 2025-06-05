<script lang="ts">
    import { AssetList, Overflow, Pane, ReceiveAddressButton } from '@ui'
    import { AccountSummary, AccountActivity, SendButton } from '@components'
    import { isValidBech32AddressAndPrefix, BECH32_DEFAULT_HRP } from '@core/utils'
    import { selectedAccountAssets } from '@core/wallet'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'
    import { HexAddressBox } from 'shared/components'

    let hasHexAddressToShow = false
    $: if (isValidBech32AddressAndPrefix($selectedAccount?.depositAddress, BECH32_DEFAULT_HRP)) {
        hasHexAddressToShow = true
    }
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <div class="flex flex-col space-y-4">
                    <Pane overflow={Overflow.Visible}>
                        {#if features?.wallet?.accountSummary?.enabled}
                            <AccountSummary />
                        {/if}
                    </Pane>
                    <Pane>
                        <div class={`flex flex-col ${hasHexAddressToShow ? 'space-y-2' : 'space-y-6'}`}>
                            {#if features?.wallet?.sendAndReceive?.enabled}
                                {#if !hasHexAddressToShow}
                                    <SendButton />
                                {/if}
                                <ReceiveAddressButton />
                                {#if hasHexAddressToShow}
                                    <HexAddressBox address={$selectedAccount?.depositAddress} isCopyable />
                                {/if}
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

<style lang="scss">
    hex-address-box {
        @apply border;
        @apply border-solid;
        @apply border-gray-300;
        &:hover {
            @apply bg-blue-50;
            @apply border-gray-500;
        }
        &:active,
        &:focus {
            @apply bg-blue-100;
            @apply border-blue-400;
        }
        &.darkmode {
            @apply border-gray-700;
            &:hover,
            &:focus,
            &:active {
                @apply bg-gray-700;
                @apply bg-opacity-20;
                @apply border-opacity-50;
            }
            &:disabled {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                @apply border-gray-700;
                @apply border-opacity-10;
            }
        }
    }
</style>

<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { activeWalletTab, WALLET_TAB_COMPONENT } from '../../lib/contexts/wallet'
    import { TabNavigator } from './wallet/tabs'
</script>

{#if $selectedAccount}
    <div class="flex flex-col w-screen h-screen">
        <div class="w-full h-18">BALANCE PLACEHOLDER</div>
        <div class="flex flex-col flex-auto w-full">
            <div class="flex-auto">
                <svelte:component this={WALLET_TAB_COMPONENT[$activeWalletTab]} />
            </div>
            <TabNavigator />
        </div>
    </div>
{/if}

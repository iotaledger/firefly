<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { activeWalletTab, WALLET_TAB_COMPONENT } from '../../lib/contexts/wallet'
    import { TabNavigator } from './wallet/tabs'
</script>

{#if $selectedAccount}
    <div class="flex flex-col w-screen h-screen bg-white dark:bg-gray-800">
        <div class="w-full h-18">BALANCE PLACEHOLDER</div>
        <div class="relative flex flex-col flex-auto w-full">
            <div class="z-0 flex-auto">
                <svelte:component this={WALLET_TAB_COMPONENT[$activeWalletTab]} />
            </div>
            <div class="z-10">
                <TabNavigator />
            </div>
        </div>
    </div>
{/if}

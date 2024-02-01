<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { sumBalanceForWallets } from '@core/wallet'
    import { selectedWallet } from '@core/wallet/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile, getBaseToken, visibleActiveWallets } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { WalletSwitcherMenuItem, FontWeight, Icon, Modal, Text, TextType } from '@ui'
    import { tick } from 'svelte'

    export let modal: Modal = undefined

    $: totalBalance = sumBalanceForWallets($visibleActiveWallets)
    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network.id])

    async function scrollToSelectedWallet(): Promise<void> {
        await tick()
        const element = document.getElementById(`wallet-${$selectedWallet.id}`)
        element?.scrollIntoView({ behavior: 'auto' })
    }

    function oncreateWalletClick(): void {
        modal?.close()
        openPopup({ id: PopupId.createWallet })
    }
</script>

<Modal
    bind:this={modal}
    on:open={scrollToSelectedWallet}
    classes="transform -translate-x-1/2"
    size="large"
    position={{ top: '30px', left: '50%' }}
>
    <wallet-list-container class="block p-4">
        <wallet-list class="flex flex-col space-y-1 max-h-96 scrollable-y">
            {#each $visibleActiveWallets as wallet}
                <WalletSwitcherMenuItem id="wallet-{wallet.id}" {wallet} onClick={modal?.close} />
            {/each}
        </wallet-list>
    </wallet-list-container>
    <hr />
    <button
        type="button"
        class=" flex flex-row justify-between w-full p-8 hover:bg-gray-50 dark:hover:bg-gray-800"
        on:click={oncreateWalletClick}
    >
        <div class="flex flex-row items-center text-right space-x-4">
            <Icon icon={IconEnum.Plus} height="12" width="12" classes="text-blue-500" />
            <Text highlighted type={TextType.h5} classes="text-14">{localize('general.addAWallet')}</Text>
        </div>
        <div class="flex flex-col items-end text-right space-y-1">
            <Text type={TextType.h5}>
                {formatTokenAmountBestMatch(totalBalance, getBaseToken())}
            </Text>
            <Text fontSize="12" fontWeight={FontWeight.semibold} lineHeight="20" color="blue-500">
                {formatCurrency(getMarketAmountFromAssetValue(totalBalance, baseCoin))}
            </Text>
        </div>
    </button>
</Modal>

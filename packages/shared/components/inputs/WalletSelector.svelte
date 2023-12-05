<script lang="ts">
    import { Modal, WalletLabel, Text, TextType } from 'shared/components'
    import { fade } from 'svelte/transition'
    import { visibleActiveWallets, getBaseToken } from '@core/profile'
    import { IWalletState, formatTokenAmountBestMatch, selectedWallet } from '@core/wallet'

    export let hideSelectedWallet: boolean = false
    export let wallet: IWalletState | undefined = $selectedWallet

    let modal: Modal | undefined

    $: wallets = $visibleActiveWallets?.filter(
        (wallet) => wallet.id !== $selectedWallet?.id || !hideSelectedWallet
    )

    function getSuffixForWallet(wallet: IWalletState): string {
        return formatTokenAmountBestMatch(Number(wallet.balances.baseCoin.available), getBaseToken())
    }

    function onClick(_selected: IWalletState): void {
        modal?.close()
        wallet = _selected
    }

    function handleFilteredAccountClick(wallet: IWalletState): () => void {
        return () => onClick(wallet)
    }
</script>

<wallet-input class="w-full h-full relative">
    <button
        on:click={modal?.open}
        class="w-full flex flex-row flex-1 justify-between px-4 py-3 rounded-lg border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600"
    >
        <WalletLabel {wallet} />
    </button>

    {#if wallets?.length > 0}
        <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4">
            <recipient-wallet-picker-modal
                class="max-h-64 flex flex-col space-y-1 scrollable-y"
                in:fade={{ duration: 100 }}
            >
                {#each wallets as wallet}
                    {@const handleOnClick = handleFilteredAccountClick(wallet)}
                    <button
                        on:click={handleOnClick}
                        class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                    >
                        <WalletLabel {wallet} />
                        <Text type={TextType.pre} fontSize="sm" color="gray-600">{getSuffixForWallet(wallet)}</Text>
                    </button>
                {/each}
            </recipient-wallet-picker-modal>
        </Modal>
    {/if}
</wallet-input>

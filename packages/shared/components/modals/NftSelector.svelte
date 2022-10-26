<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { ADDRESS_TYPE_NFT, convertHexAddressToBech32 } from '@core/wallet'
    import { Modal, Text, TextType } from 'shared/components'
    import { truncateString } from '@core/utils'
    import { fade } from 'svelte/transition'

    export let modal: Modal = undefined
    export let selected: string = undefined
    export let onClose: () => void

    $: nftIds =
        $selectedAccount.balances?.nfts.map((hexNftId) => {
            const nftId = convertHexAddressToBech32(ADDRESS_TYPE_NFT, hexNftId)
            return { value: nftId, label: truncateString(nftId, 9, 9) }
        }) ?? []

    function onClick(_selected: string): void {
        modal?.close()
        selected = _selected
    }
</script>

{#if nftIds?.length > 0}
    <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4" on:close={onClose}>
        <alias-picker-modal class="max-h-64 flex flex-col space-y-1 scrollable-y" in:fade={{ duration: 100 }}>
            {#each nftIds as nftId, index}
                <button
                    on:click={() => onClick(nftId.value)}
                    class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <Text type={TextType.pre} fontSize="sm" color="gray-600">Nft {index + 1}</Text>
                    <Text type={TextType.pre} fontSize="sm" color="gray-600">{nftId.label}</Text>
                </button>
            {/each}
        </alias-picker-modal>
    </Modal>
{/if}

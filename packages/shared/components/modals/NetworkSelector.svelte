<script lang="typescript">
    import { activeProfile } from '@core/profile'
    import { DestinationNetwork, NETWORK_ADDRESS } from '@core/network'
    import { truncateString } from '@lib/helpers'
    import { Modal, Text, TextType } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let modal: Modal = undefined
    export let selected: DestinationNetwork
    export let onClose: () => void

    const networks = Object.values(DestinationNetwork)

    function onClick(_selected: DestinationNetwork): void {
        modal?.close()
        selected = _selected
    }
</script>

{#if networks.length > 0}
    <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4" on:close={onClose}>
        <network-picker-modal class="max-h-64 flex flex-col space-y-1 scrollable-y" in:fade={{ duration: 100 }}>
            {#each networks as network}
                <button
                    on:click={() => onClick(network)}
                    class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <Text type={TextType.pre} fontSize="sm" color="gray-800">{network}</Text>
                    <Text type={TextType.pre} fontSize="sm" color="gray-600">
                        {truncateString(NETWORK_ADDRESS[$activeProfile.networkType][network], 6, 6)}
                    </Text>
                </button>
            {/each}
        </network-picker-modal>
    </Modal>
{/if}

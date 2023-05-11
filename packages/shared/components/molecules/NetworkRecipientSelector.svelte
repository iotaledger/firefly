<script lang="ts">
    import { NetworkRecipientItem } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'

    export let options: INetworkRecipientSelectorOption[]
    export let selectedIndex = -1

    function onItemClick(index: number) {
        selectedIndex = index
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if options?.length}
    <network-recipient-selector class="w-full flex flex-col space-y-4">
        {#each options as item, index}
            <NetworkRecipientItem
                bind:item
                selected={index === selectedIndex}
                onChange={() => onItemClick(index)}
                onClick={() => onItemClick(index)}
            />
        {/each}
    </network-recipient-selector>
{/if}

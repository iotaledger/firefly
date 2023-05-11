<script lang="ts">
    import { NetworkRecipientItem } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'

    export let options: INetworkRecipientSelectorOption[]
    export let selected: INetworkRecipientSelectorOption | undefined = undefined

    function onItemClick(item: INetworkRecipientSelectorOption) {
        selected = item
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if options?.length}
    <network-recipient-selector class="w-full flex flex-col space-y-4">
        {#each options as item}
            {@const itemSelected = item?.id === selected?.id}
            <NetworkRecipientItem
                bind:item
                selected={itemSelected}
                onChange={() => onItemClick(item)}
                onClick={() => onItemClick(item)}
            />
        {/each}
    </network-recipient-selector>
{/if}

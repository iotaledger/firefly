<script lang="ts">
    import { Icon } from 'shared/components'
    import { onMount } from 'svelte'

    export let selectedColor
    export let walletColors
    export let createWallet = false

    onMount(() => {
        selectedColor = createWallet ? walletColors[0] : selectedColor
    })

    const colorSelection = (color) => {
        selectedColor = color;
    }
</script>

<style>
    .color {
        border: 2px solid transparent;
        border-radius: 6px;
        box-sizing: content-box;
    }

    .color:hover {
        transition: all 0.2s ease-in-out;
    }
</style>

<div class="w-full flex justify-between flex-row my-2">
    {#each walletColors as color}
        <div class="border hover:border-{color}-200 color">
            <div
                class="bg-{color}-500 h-6 w-6 rounded flex justify-center items-center"
                on:click={() => colorSelection(color)}>
                {#if selectedColor === color}
                    <Icon icon="success-check" classes="h-6 w-4 text-white" />
                {/if}
            </div>
        </div>
    {/each}
</div>

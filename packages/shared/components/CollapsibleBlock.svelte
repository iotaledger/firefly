<script lang="typescript">
    import { Text } from 'shared/components'

    export let label: string = ''
    export let showBlock = false

    function toggleBlockContent(): void {
        showBlock = !showBlock
    }
</script>

<div class="w-full overflow-hidden">
    <div on:click={toggleBlockContent} class="flex flex-row justify-between w-full overflow-hidden cursor-pointer">
        <div class="grow"><Text type="p" secondary={!showBlock}>{label}</Text></div>
        <div class="flex-none"><Text type="p" secondary={!showBlock}>{showBlock ? '-' : '+'}</Text></div>
    </div>
    {#if showBlock}
        <div class="w-full overflow-hidden pt-4">
            <slot />
        </div>
    {/if}
</div>

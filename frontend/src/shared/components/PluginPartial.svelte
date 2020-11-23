<script lang="typescript">
    export let components = []
</script>

{#each components as item}
    <svelte:component this={item.component} {...item} events={item.events}>
        {#if item.children.length}
            <svelte:self components={item.children} />
        {:else}{item.content}{/if}
    </svelte:component>
{/each}

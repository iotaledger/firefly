<script>
    export let type = null
    export let secondary = false
    export let disabled = false
    export let classes = null
</script>

{#if type === 'h1'}
    <h1 class={classes} class:secondary class:disabled>
        <slot />
    </h1>
{:else if type === 'h2'}
    <h2 class={classes} class:secondary class:disabled>
        <slot />
    </h2>
{:else if type === 'h3'}
    <h3 class={classes} class:secondary class:disabled>
        <slot />
    </h3>
{:else if type === 'h4'}
    <h4 class={classes} class:secondary class:disabled>
        <slot />
    </h4>
{:else if type === 'p'}
    <p class={classes} class:secondary class:disabled>
        <slot />
    </p>
{/if}

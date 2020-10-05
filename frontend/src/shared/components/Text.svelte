<script>
    export let type = 'p'
    export let secondary = false
    export let disabled = false
    export let classes = null
</script>

<style type="text/scss">
    :global(h1) {
        font-weight: 700;
        font-size: 32px;
        line-height: 115%;
        color: var(--text-primary-color);
    }
    :global(h2) {
        font-weight: 700;
        font-size: 24px;
        line-height: 120%;
        color: var(--text-primary-color);
    }
    :global(h3) {
        font-weight: 700;
        font-size: 18px;
        line-height: 140%;
        color: var(--text-primary-color);
    }
    :global(h4) {
        font-weight: 700;
        font-size: 16px;
        line-height: 140%;
        color: var(--text-primary-color);
    }
    :global(p) {
        font-size: 13px;
        line-height: 140%;
        color: var(--text-primary-color);
        &.secondary {
            color: var(--text-secondary-color);
        }
        &.disabled {
            color: var(--text-disabled-color);
        }
    }
</style>

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

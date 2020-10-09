<script>
    export let type = 'p'
    export let secondary = false
    export let disabled = false
    export let highlighted = false
    export let classes = null
</script>

<style type="text/scss">
    h1 {
        font-weight: 700;
        font-size: 32px;
        line-height: 115%;
        color: var(--text-primary-color);
    }
    h2 {
        font-weight: 700;
        font-size: 24px;
        line-height: 120%;
        color: var(--text-primary-color);
    }
    h3 {
        font-weight: 700;
        font-size: 18px;
        line-height: 140%;
        color: var(--text-primary-color);
    }
    h4 {
        font-weight: 700;
        font-size: 16px;
        line-height: 140%;
        color: var(--text-primary-color);
    }
    p {
        font-size: 13px;
        line-height: 160%;
        color: var(--text-primary-color);
    }
    h1,
    h2,
    h3,
    h4,
    p {
        &.secondary {
            color: var(--text-secondary-color);
        }
        &.disabled {
            color: var(--text-disabled-color);
        }
        &.highlighted {
            color: var(--text-highlighted-color);
        }
    }
</style>

{#if type === 'h1'}
    <h1 class={classes} class:secondary class:disabled class:highlighted>
        <slot />
    </h1>
{:else if type === 'h2'}
    <h2 class={classes} class:secondary class:disabled class:highlighted>
        <slot />
    </h2>
{:else if type === 'h3'}
    <h3 class={classes} class:secondary class:disabled class:highlighted>
        <slot />
    </h3>
{:else if type === 'h4'}
    <h4 class={classes} class:secondary class:disabled class:highlighted>
        <slot />
    </h4>
{:else if type === 'p'}
    <p class={classes} class:secondary class:disabled class:highlighted>
        <slot />
    </p>
{/if}

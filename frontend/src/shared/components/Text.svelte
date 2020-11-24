<script>
    export let type = 'p'
    export let secondary = false
    export let disabled = false
    export let highlighted = false
    export let bold = false
    export let small = false
    export let error = false
    export let classes = '' // ISSUE: https://github.com/tailwindlabs/tailwindcss/discussions/1446
</script>

<style type="text/scss">
    p {
        &.small {
            @apply text-10;
            @apply leading-120;
        }
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    p {
        // TODO: tailwindify
        &.secondary {
            color: var(--text-secondary-color);
        }
        &.disabled {
            color: var(--text-disabled-color);
        }
        &.highlighted {
            color: var(--text-highlighted-color);
        }
        &.error {
            color: var(--text-error-color);
        }
    }
</style>

{#if type === 'h1'}
    <h1
        class={`font-bold text-32 leading-120 text-blue-900 dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error>
        <slot />
    </h1>
{:else if type === 'h2'}
    <h2
        class={`font-bold text-24 leading-120 text-blue-900 dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error>
        <slot />
    </h2>
{:else if type === 'h3'}
    <h3
        class={`font-bold text-18 leading-140 text-blue-900 dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error>
        <slot />
    </h3>
{:else if type === 'h4'}
    <h4
        class={`font-bold text-16 leading-140 text-blue-900 dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error>
        <slot />
    </h4>
{:else if type === 'h5'}
    <h5
        class={`font-bold text-14 leading-140  text-blue-900 dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error>
        <slot />
    </h5>
{:else if type === 'p'}
    <p
        class={`text-13 leading-160 text-blue-900  dark:text-white ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:small
        class:font-bold={bold}>
        <slot />
    </p>
{/if}

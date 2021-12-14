
<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'

    export let type = 'p'
    export let secondary = false
    export let disabled = false
    export let highlighted = false
    export let bold = false
    export let smaller = false
    export let bigger = false
    export let error = false
    export let overrideColor = false
    export let overrideLeading = false
    export let classes = '' // ISSUE: https://github.com/tailwindlabs/tailwindcss/discussions/1446

    $: darkModeEnabled = $appSettings.darkMode
</script>

<style type="text/scss">
    p {
        &.smaller {
            @apply text-12;
            &:not(.overrideLeading) {
                @apply leading-120;
            }
        }
        &.bigger {
            @apply text-16;
            @apply leading-140;
        }
    }
    pre {
        &.smaller {
            @apply text-11;
        }
        &.bigger {
            @apply text-13;
        }
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    pre {
        // TODO: tailwindify
        &.secondary {
            @apply text-gray-500;
        }
        &.disabled {
            @apply text-gray-400;
            &.darkmode {
                @apply text-gray-600;
            }
        }
        &.highlighted {
            @apply text-blue-500;
        }
        &.error {
            @apply text-red-500;
        }
    }
    pre {
        font-family: 'IBM Plex Mono', monospace;
        @apply font-normal;
        @apply break-all;
        @apply whitespace-pre-line;
    }
</style>

{#if type === 'h1'}
    <h1
        class={`font-bold text-32 leading-120 ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:darkmode={darkModeEnabled}>
        <slot />
    </h1>
{:else if type === 'h2'}
    <h2
        class={`font-bold text-24 leading-120 ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:darkmode={darkModeEnabled}>
        <slot />
    </h2>
{:else if type === 'h3'}
    <h3
        class={`font-bold text-18 leading-140 ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:darkmode={darkModeEnabled}>
        <slot />
    </h3>
{:else if type === 'h4'}
    <h4
        class={`font-bold text-16 leading-140 ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:darkmode={darkModeEnabled}>
        <slot />
    </h4>
{:else if type === 'h5'}
    <h5
        class={`font-bold text-14 leading-140  ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:darkmode={darkModeEnabled}>
        <slot />
    </h5>
{:else if type === 'p'}
    <p
        class={`text-13 ${overrideLeading ? '' : 'leading-160'}  ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:smaller
        class:overrideLeading
        class:bigger
        class:font-bold={bold}
        class:darkmode={darkModeEnabled}>
        <slot />
    </p>
{:else if type === 'pre'}
    <pre
        class={`text-12 leading-140 ${overrideColor ? '' : 'text-gray-800 dark:text-white'} ${classes}`}
        class:secondary
        class:disabled
        class:highlighted
        class:error
        class:smaller
        class:bigger
        class:font-bold={bold}
        class:darkmode={darkModeEnabled}>
        <slot />
    </pre>
{/if}

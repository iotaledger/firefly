<script lang="typescript">
    import { clickOutside } from 'shared/lib/actions'
    import { fade } from 'svelte/transition'

    enum Size {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    export let isActive = false
    export let position: { top?: string; right?: string; bottom?: string; left?: string } = {}
    export let size: Size = Size.Medium
    export let classes: string = ''

    const { top = 'inherit', right = 'inherit', bottom = 'inherit', left = 'inherit' } = position
</script>

{#if isActive}
    <modal-content
        in:fade={{ duration: 100 }}
        use:clickOutside
        on:clickOutside={() => (isActive = false)}
        class="{size} bg-white dark:bg-gray-900 border border-solid border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden z-10 {classes}"
        style="--modal-position-top: {top}; --modal-position-right: {right}; --modal-position-bottom: {bottom}; --modal-position-left: {left};"
    >
        <slot />
    </modal-content>
{/if}

<style type="text/scss">
    modal-content {
        position: absolute;
        min-width: 230px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        top: var(--modal-position-top);
        right: var(--modal-position-right);
        bottom: var(--modal-position-bottom);
        left: var(--modal-position-left);
        &.large {
            min-width: 420px;
        }
    }
</style>

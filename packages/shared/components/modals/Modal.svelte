<script>
    import { fade } from 'svelte/transition'

    export let isActive = false
    export let position = {}

    const { top = 'inherit', right = 'inherit', bottom = 'inherit', left = 'inherit' } = position
</script>

<style type="text/scss">
    modal-content {
        position: absolute;
        min-width: 230px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        top: var(--modal-position-top);
        right: var(--modal-position-right);
        bottom: var(--modal-position-bottom);
        left: var(--modal-position-left);
    }
</style>

{#if isActive}
    <modal-shield class="fixed left-0 top-0 right-0 bottom-0 bg-transparent z-0" on:click={() => (isActive = false)} />
    <modal-content
        in:fade={{ duration: 100 }}
        class="bg-white dark:bg-gray-900 border border-solid border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden z-10"
        style="--modal-position-top: {top}; --modal-position-right: {right}; --modal-position-bottom: {bottom}; --modal-position-left: {left};">
        <slot />
    </modal-content>
{/if}

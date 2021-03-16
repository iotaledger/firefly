<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { clickOutside } from 'shared/lib/actions'

    export let isActive = false
    export let position: {left?: number, right?: number, top?: number, bottom?: number} = {}

    let style;

    $: {
        style = ''
        for (const prop in position) {
            style += `${prop}: ${position[prop]};`;
        }
    }
</script>

<style type="text/scss">
    modal-content {
        position: absolute;
        min-width: 230px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    }
</style>

{#if isActive}
    <modal-content
        in:fade={{ duration: 100 }}
        use:clickOutside
        on:clickOutside={() => (isActive = false)}
        class="bg-white dark:bg-gray-900 border border-solid border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden z-10"
        {style}>
        <slot />
    </modal-content>
{/if}

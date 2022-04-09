<script lang="typescript">
    import { clickOutside } from 'shared/lib/actions'
    import { fade } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'

    enum Size {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    export let position: { top?: string; right?: string; bottom?: string; left?: string } = {}
    export let size: Size = Size.Medium
    export let classes: string = ''
    export let disableOnClickOutside = false

    export function close(): void {
        setShow(false)
    }
    export function open(): void {
        setShow(true)
    }
    export function toggle(): void {
        show ? close() : open()
    }
    export function isOpened(): boolean {
        return show
    }

    const { top = 'inherit', right = 'inherit', bottom = 'inherit', left = 'inherit' } = position
    const dispatch = createEventDispatcher()

    function setShow(bool: boolean) {
        if (!isBlockedByTimeout) {
            show = bool
            isBlockedByTimeout = true
            setTimeout(() => (isBlockedByTimeout = false), 100)
            show ? dispatch('open') : dispatch('close')
        }
    }

    function handleOnClickOutside(): void {
        if (disableOnClickOutside) return
        close()
    }

    let isBlockedByTimeout = false
    let show = false
</script>

{#if show}
    <modal-content
        in:fade={{ duration: 100 }}
        use:clickOutside
        on:clickOutside={handleOnClickOutside}
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

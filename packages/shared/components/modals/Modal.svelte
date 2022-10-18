<script lang="typescript">
    import { clickOutside } from 'shared/lib/actions'
    import { fade } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'

    export let position: { top?: string; right?: string; bottom?: string; left?: string; absolute?: boolean } = {}
    export let size: 'small' | 'medium' | 'large' = 'medium'
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

    const { top = 'inherit', right = 'inherit', bottom = 'inherit', left = 'inherit', absolute = 'true' } = position
    const dispatch = createEventDispatcher()

    function setShow(bool: boolean): void {
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
        class="{size} shadow-elevation-4 bg-white dark:bg-gray-900 border border-solid border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden z-10 {classes}"
        style="--modal-position-top: {top}; --modal-position-right: {right}; --modal-position-bottom: {bottom}; --modal-position-left: {left}; --modal-position: {absolute
            ? 'absolute'
            : 'relative'};"
    >
        <slot />
    </modal-content>
{/if}

<style type="text/scss">
    modal-content {
        position: var(--modal-position);
        top: var(--modal-position-top);
        right: var(--modal-position-right);
        bottom: var(--modal-position-bottom);
        left: var(--modal-position-left);
        &.medium {
            min-width: 230px;
        }
        &.large {
            min-width: 420px;
        }
    }
</style>

<script lang="typescript">
    import { Animation, Icon, Text } from 'shared/components'
    import { keyboardHeight, isKeyboardOpen } from '../lib/auxiliary/keyboard'

    export let allowBack = true
    export let animation = ''
    export let busy = false
    export let title = ''

    export let onBackClick = (): void => {}

    let scrollWraper: HTMLElement

    $: if ($isKeyboardOpen) {
        setTimeout(() => {
            scrollWraper?.scrollTo({ top: 100 })
        })
    }
</script>

<div data-label="mobile-onboarding-layout" class="relative h-full p-5 flex flex-col justify-between">
    <header class="relative w-full flex justify-center px-6">
        <Text type="h4" classes="text-center">{title}</Text>
        {#if allowBack}
            <button on:click={onBackClick} class="absolute left-0" disabled={busy}>
                <Icon
                    icon="arrow-left"
                    classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'}
                />
            </button>
        {/if}
    </header>
    <div class="flex flex-col overflow-y-auto h-full pt-5">
        {#if animation && $isKeyboardOpen === false}
            <div class="mt-24 w-full flex justify-center">
                <Animation {animation} />
            </div>
        {/if}
        <div bind:this={scrollWraper} class="overflow-hidden">
            <slot name="content" />
        </div>
    </div>
    <footer style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`}>
        <slot name="footer" />
    </footer>
</div>

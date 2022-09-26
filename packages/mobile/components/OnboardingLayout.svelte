<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { keyboardHeight, isKeyboardOpen } from '../lib/app'

    export let allowBack = true
    export let busy = false
    export let reverseContent = false

    export let onBackClick = (): void => {}

    let scrollWraper: HTMLElement

    $: if ($isKeyboardOpen) {
        setTimeout(() => {
            scrollWraper?.scrollTo({ top: 100 })
        })
    }
</script>

<div data-label="mobile-onboarding-layout" class="relative h-full p-5 pb-8 flex flex-col justify-between">
    <header class="relative w-full flex justify-center">
        <Text type="h4" classes="text-center">
            <slot name="title" />
        </Text>
        {#if allowBack}
            <button on:click={onBackClick} class="absolute left-0" disabled={busy}>
                <Icon
                    icon="arrow-left"
                    classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'}
                />
            </button>
        {/if}
    </header>
    <!-- TODO: fix flex-col-reverse scrolls mobile-top-content to bottom -->
    <div class="flex {reverseContent ? 'flex-col-reverse' : 'flex-col'} overflow-y-auto h-full pt-5 justify-between">
        <div class={$isKeyboardOpen && 'h-0'}>
            <slot name="illustration" />
        </div>
        <div bind:this={scrollWraper} class="overflow-hidden">
            <slot name="content" />
        </div>
    </div>
    <footer style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`}>
        <slot name="footer" />
    </footer>
</div>

<style type="text/scss">
    header {
        margin-top: env(safe-area-inset-top);
        :global(h1),
        :global(h2),
        :global(h3),
        :global(h4),
        :global(h5) {
            @apply font-bold;
            @apply text-16;
            @apply leading-140;
        }
    }
    footer {
        margin-bottom: env(safe-area-inset-bottom);
    }
    .highlight {
        transition: filter 0.2s;

        &:focus {
            filter: brightness(1.3);
        }
    }
</style>

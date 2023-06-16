<script lang="ts">
    import { Animation, Icon, Text, TextType } from '@ui'

    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    import { isKeyboardOpen, keyboardHeight } from '@/auxiliary/keyboard'

    export let allowBack = true
    export let animation = ''
    export let busy = false
    export let title = ''

    export let onBackClick = (): void => {}

    const HEIGHT_OFFSET = 60

    let windowElementHeight: number
    let headerElementHeight: number
    let contentElementHeight: number
    let footerElementHeight: number

    let animationHeight: number = 0

    $: animation,
        $isKeyboardOpen,
        windowElementHeight,
        headerElementHeight,
        contentElementHeight,
        footerElementHeight,
        updateHeight()

    function updateHeight(): void {
        animationHeight =
            $isKeyboardOpen || !animation
                ? 0
                : windowElementHeight -
                  (headerElementHeight + contentElementHeight + footerElementHeight + HEIGHT_OFFSET)
    }
</script>

<div
    bind:clientHeight={windowElementHeight}
    data-label="mobile-onboarding-layout"
    class="relative h-full p-5 flex flex-col justify-between"
>
    <header class="relative w-full flex justify-center px-6" bind:clientHeight={headerElementHeight}>
        <Text type={TextType.h4} classes="text-center">{title}</Text>
        {#if allowBack}
            <button on:click={onBackClick} class="absolute left-0" disabled={busy}>
                <Icon
                    icon={IconEnum.ArrowLeft}
                    classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'}
                />
            </button>
        {/if}
    </header>
    <div class="flex flex-col flex-auto max-h-full py-5 justify-between overflow-hidden">
        {#if animation && $isKeyboardOpen === false && animationHeight > 0}
            <animation-wrapper style:--height="{animationHeight}px">
                <Animation {animation} classes="max-h-full" />
            </animation-wrapper>
        {/if}
        <div class="flex overflow-hidden {animation ? 'h-auto' : 'flex-auto'}" bind:clientHeight={contentElementHeight}>
            <slot name="content" class="shrink-0 h-auto" />
        </div>
    </div>
    <footer style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`} bind:clientHeight={footerElementHeight}>
        <slot name="footer" />
    </footer>
</div>

<style lang="scss">
    animation-wrapper {
        @apply relative w-full flex justify-center;
        height: var(--height);
    }
</style>

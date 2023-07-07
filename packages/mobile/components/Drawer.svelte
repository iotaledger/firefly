<script lang="ts">
    import { fade, fly } from 'svelte/transition'

    import { Icon, Text, TextType } from '@ui'

    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'

    import {
        DRAWER_IN_ANIMATION_DURATION_MS,
        DRAWER_OUT_ANIMATION_DURATION_MS,
        DRAWER_STATIC_TITLE_TITLES,
        DrawerId,
    } from '@/auxiliary/drawer'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    import { isKeyboardOpen, keyboardHeight } from '@/auxiliary/keyboard'

    export let onBack: () => unknown = () => {}
    export let onClose: () => unknown = () => {}
    export let allowBack: boolean = false
    export let title: string | undefined = undefined
    export let fullScreen: boolean = false
    export let enterFromSide: boolean = false
    export let id: DrawerId = undefined
    export let preventClose: boolean = false

    let position = 0
    let moving = false
    let panelHeight = 0
    let panelWidth = 0
    let touchStart = 0

    $: staticTile = DRAWER_STATIC_TITLE_TITLES[id] ? localize(DRAWER_STATIC_TITLE_TITLES[id]) : undefined
    $: displayedTitle = title ?? staticTile

    $: darkModeEnabled = $appSettings.darkMode

    const directon = enterFromSide ? { x: -100 } : { y: 100 }

    function onOverlayClick(): void {
        if (!preventClose) {
            onClose && onClose()
        }
    }

    function onTouchStart(event): void {
        if (!preventClose) {
            moving = true
            const { pageX, pageY } = event.touches[0]
            touchStart = enterFromSide ? -pageX : pageY
        }
    }

    function onTouchMove(event): void {
        if (!preventClose) {
            if (moving && event.targetTouches.length === 1) {
                const { pageX, pageY } = event.touches[0]
                const nextTouch = enterFromSide ? -pageX : pageY
                position = Math.min(touchStart - nextTouch, 0)
            }
        }
    }

    function onTouchEnd(): void {
        if (!preventClose) {
            moving = false
            const panelSize = enterFromSide ? panelWidth : panelHeight
            if (position < -panelSize / 3) {
                onClose && onClose()
            } else {
                position = 0
            }
        }
    }
</script>

<svelte:window on:touchend={onTouchEnd} on:touchmove={onTouchMove} />
<drawer class="fixed top-0 left-0 w-screen h-screen">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <overlay
        in:fade|local={{ duration: DRAWER_IN_ANIMATION_DURATION_MS }}
        out:fade|local={{ duration: DRAWER_OUT_ANIMATION_DURATION_MS }}
        on:click={onOverlayClick}
        class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
    />
    <panel
        on:touchstart={onTouchStart}
        in:fly|local={{ ...directon, duration: DRAWER_IN_ANIMATION_DURATION_MS }}
        out:fly|local={{ ...directon, duration: DRAWER_OUT_ANIMATION_DURATION_MS }}
        bind:clientHeight={panelHeight}
        bind:clientWidth={panelWidth}
        class:moving
        class:h-screen={fullScreen && enterFromSide}
        class:safe-area-top-from-side={fullScreen && enterFromSide}
        class:safe-area-top={fullScreen && !enterFromSide}
        class:rounded-t-2xl={!enterFromSide}
        class:darkmode={darkModeEnabled}
        style:--left={enterFromSide ? `${position}px` : '0px'}
        style:--bottom={enterFromSide ? '0px' : `${position}px`}
        style:--border-bottom={`${$isKeyboardOpen ? $keyboardHeight : 0}px solid transparent`}
    >
        {#if enterFromSide === false}
            <decorator
                class="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded"
            />
        {/if}
        {#if displayedTitle || allowBack}
            <div class="grid grid-cols-4 h-6 mb-6">
                <div class="col-span-1">
                    {#if allowBack}
                        <button type="button" on:click={onBack}>
                            <Icon width="24" height="24" icon={IconEnum.ArrowLeft} classes="text-gray-500" />
                        </button>
                    {/if}
                </div>
                <div class="flex justify-center col-span-2 content-center">
                    {#if displayedTitle}
                        <Text type={TextType.h4} classes="text-center">{displayedTitle}</Text>
                    {/if}
                </div>
            </div>
        {/if}
        <slot />
    </panel>
</drawer>

<style lang="scss">
    panel {
        @apply fixed w-full max-h-full;
        @apply flex flex-col flex-auto overflow-hidden;
        @apply pt-7 px-5;
        @apply bg-white;
        @apply safe-area-bottom;
        transition: bottom 0.2s ease;
        left: var(--left);
        bottom: var(--bottom);
        border-bottom: var(--border-bottom);
        &.moving {
            @apply transition-none;
        }
        &.darkmode {
            @apply bg-gray-800;
        }
    }
    .safe-area-top {
        height: calc(100vh - env(safe-area-inset-top) - 1.75rem);
    }
    .safe-area-top-from-side {
        padding-top: calc(env(safe-area-inset-top) + 1.75rem);
    }
    .safe-area-bottom {
        padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem);
    }
</style>

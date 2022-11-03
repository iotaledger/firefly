<script lang="typescript">
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Icon, Text, TextType } from 'shared/components'
    import { fade, fly } from 'svelte/transition'

    export let onClose: () => unknown = () => {}
    export let onBackClick: () => unknown = () => {}
    export let allowBack: boolean = false
    export let title: string | undefined = undefined
    export let fullScreen: boolean = false
    export let enterFromSide: boolean = false

    let position = 0
    let moving = false
    let panelHeight = 0
    let panelWidth = 0
    let touchStart = 0

    const directon = enterFromSide ? { x: -100 } : { y: 100 }

    function onTouchStart(event): void {
        moving = true
        const { pageX, pageY } = event.touches[0]
        touchStart = enterFromSide ? -pageX : pageY
    }

    function onTouchMove(event): void {
        if (moving && event.targetTouches.length === 1) {
            const { pageX, pageY } = event.touches[0]
            const nextTouch = enterFromSide ? -pageX : pageY
            position = Math.min(touchStart - nextTouch, 0)
        }
    }

    function onTouchEnd(): void {
        moving = false
        const panelSize = enterFromSide ? panelWidth : panelHeight
        if (position < -panelSize / 3) {
            onClose()
        } else {
            position = 0
        }
    }
</script>

<svelte:window on:touchend={onTouchEnd} on:touchmove={onTouchMove} />
<drawer class="fixed top-0 left-0 z-30 w-screen h-screen z-40">
    <overlay
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 200 }}
        on:click={onClose}
        class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
    />
    <panel
        on:touchstart={onTouchStart}
        in:fly={{ ...directon, duration: 300 }}
        out:fly={{ ...directon, duration: 200 }}
        bind:clientHeight={panelHeight}
        bind:clientWidth={panelWidth}
        class:moving
        class="py-6 px-5 fixed w-full flex flex-col flex-auto {fullScreen
            ? 'h-screen'
            : ''} z-10 bg-white dark:bg-gray-800 {enterFromSide ? '' : 'rounded-t-2xl'}"
        style={enterFromSide ? `left: ${position}px;` : `bottom: ${position}px;`}
    >
        {#if enterFromSide === false}
            <decorator
                class="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded"
            />
        {/if}
        {#if title || (allowBack && onBackClick)}
            <div class="grid grid-cols-4 h-6 mb-6">
                <div class="col-span-1">
                    {#if allowBack && onBackClick}
                        <button type="button" on:click={onBackClick}>
                            <Icon width="24" height="24" icon={IconEnum.ArrowLeft} classes="text-gray-500" />
                        </button>
                    {/if}
                </div>
                <div class="flex justify-center col-span-2 content-center">
                    {#if title}
                        <Text type={TextType.h4}>{title}</Text>
                    {/if}
                </div>
            </div>
        {/if}
        <slot />
    </panel>
</drawer>

<style type="text/scss">
    panel {
        transition: bottom 0.2s ease;
        max-height: 100%;
        &.moving {
            transition: none;
        }
    }
</style>

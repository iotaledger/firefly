<script lang="typescript">
    import { slidable } from '@lib/actions'
    import { tweened } from 'svelte/motion'
    import { quintOut } from 'svelte/easing'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    const positionX = tweened(0, { duration: 350, easing: quintOut })
    const viewportLength = window.innerWidth
    let isVelocityReached: boolean = false

    async function handleSlideMove(event: CustomEvent): Promise<void> {
        const displacement = Math.abs(event.detail.endX - event.detail.initX)
        const time = (event.detail.endTime - event.detail.initTime) / 1000
        const slideVelocity = Math.round(displacement / time) || 0
        isVelocityReached = slideVelocity > 600

        await positionX.update(($positionX) => event.detail.sx + $positionX)
    }

    async function handleSlideEnd(): Promise<void> {
        const isThresholdUnreached = viewportLength / 2 < $positionX || -viewportLength / 2 > $positionX

        if (isVelocityReached || isThresholdUnreached) {
            const offscreenX = $positionX < 0 ? -viewportLength : viewportLength * 2
            await positionX.update(() => offscreenX)
            dispatch('close')
        } else {
            await positionX.update(() => 0)
        }
    }

    const getScale = (coord: number, scale: number): number => (viewportLength - coord) / scale
    $: contentOpacity = $positionX < 0 ? getScale(-$positionX, 300) : getScale($positionX, 300)
</script>

<swiper
    use:slidable
    on:slideMove={handleSlideMove}
    on:slideEnd={handleSlideEnd}
    style="--x: {$positionX}px; --opacity: {contentOpacity};"
>
    <slot />
</swiper>

<style type="text/scss">
    swiper {
        display: block;
        will-change: transform;
        transform: translateX(var(--x));
        opacity: var(--opacity);
    }
</style>

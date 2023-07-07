<script lang="typescript">
    import { tweened } from 'svelte/motion'
    import { quintOut } from 'svelte/easing'

    import { slidable } from '@core/utils'

    import { removeDisplayNotification } from '@auxiliary/notification/stores'

    export let toastId: string = undefined

    const positionX = tweened(0, { duration: 350, easing: quintOut })
    const viewportLength = window.innerWidth

    let isVelocityReached: boolean = false

    async function onSlideMove(event: CustomEvent): Promise<void> {
        const displacement = Math.abs(event.detail.endX - event.detail.initX)
        const time = (event.detail.endTime - event.detail.initTime) / 1000
        const slideVelocity = Math.round(displacement / time) || 0
        isVelocityReached = slideVelocity > 600
        await positionX.update(($positionX) => event.detail.sx + $positionX)
    }

    async function onSlideEnd(): Promise<void> {
        const isThresholdUnreached = viewportLength / 2 < $positionX || -viewportLength / 2 > $positionX
        if (isVelocityReached || isThresholdUnreached) {
            const offscreenX = $positionX < 0 ? -viewportLength : viewportLength * 2
            await positionX.update(() => offscreenX)
            removeDisplayNotification(toastId)
        } else {
            await positionX.update(() => 0)
        }
    }

    const getScale = (coord: number, scale: number): number => (viewportLength - coord) / scale

    $: contentOpacity = $positionX < 0 ? getScale(-$positionX, 300) : getScale($positionX, 300)
</script>

<swiper
    use:slidable
    on:slideMove={onSlideMove}
    on:slideEnd={onSlideEnd}
    style:--x={$positionX + 'px'}
    style:--opacity={contentOpacity}
>
    <slot />
</swiper>

<style lang="scss">
    swiper {
        display: block;
        will-change: transform;
        transform: translateX(var(--x));
        opacity: var(--opacity);
    }
</style>

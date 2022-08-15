<script lang="typescript">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { quintOut } from 'svelte/easing'
    import tailwindConfig from 'shared/tailwind.config.js'

    export let callback = async (): Promise<void> => {}
    export let eventTarget: HTMLElement | Window = window
    export let isRefreshing = false
    export let platform = 'android'

    const SWIPE_MAX = window.screen.availHeight / 2
    const DEFAULT_ANIMATION_DURATION = 350 // ms
    const DEFAULT_ANIMATION_VALUES = {
        arrowScale: 0,
        draw: 0,
        opacity: 0,
        position: 0,
        rotation: 0,
        scale: 1,
    }

    const positionEasing = (n: number) => (n * (Math.log(2 + (SWIPE_MAX - n) / SWIPE_MAX) / Math.log(2))) / 2

    function animationValuesEasing(n: number) {
        const position = positionEasing(n)
        const arrowScale = Math.min(position / (SWIPE_MAX / 6) - 0.5, 1)
        const draw = (position / (SWIPE_MAX / 6)) * 1000 - 500
        const opacity = Math.max(Math.min(position / (SWIPE_MAX / 6) - 0.5, 1), 0.5)
        const rotation = (position / (SWIPE_MAX / 6)) * 360 - 180
        return { position, arrowScale, draw, opacity, rotation }
    }

    const animationValues = tweened(DEFAULT_ANIMATION_VALUES, {
        duration: DEFAULT_ANIMATION_DURATION,
        easing: quintOut,
    })

    let startY = 0
    let y = 0

    $: {
        if ($animationValues.scale === 0) {
            resetValues(0)
        }

        if (isRefreshing) {
            setAnimationValues({ position: SWIPE_MAX / 3 })
        }
    }

    function setAnimationValues(
        animationValuesObject: Record<string, unknown>,
        duration: number = DEFAULT_ANIMATION_DURATION
    ): void {
        animationValues.set(
            {
                ...$animationValues,
                ...animationValuesObject,
            },
            { duration }
        )
    }

    function resetValues(duration: number = DEFAULT_ANIMATION_DURATION): void {
        startY = 0
        y = 0
        setAnimationValues(DEFAULT_ANIMATION_VALUES, duration)
    }

    function onTouchStart(event: TouchEvent): void {
        resetValues(0)
        startY = event.touches[0].clientY
    }

    function onTouchMove(event: TouchEvent): void {
        const clientY = event.touches[0].clientY
        y = clientY > SWIPE_MAX ? SWIPE_MAX : clientY
        const movedY = y - startY
        if (platform === 'android') {
            setAnimationValues(animationValuesEasing(movedY), 0)
        } else if (platform === 'ios') {
            setAnimationValues({ position: positionEasing(movedY) }, 0)
        }
    }

    function onTouchEnd(event: TouchEvent): void {
        if (
            (platform === 'android' && $animationValues.opacity === 1) ||
            (platform === 'ios' && $animationValues.position >= SWIPE_MAX / 2.5)
        ) {
            callback().then(() => setAnimationValues({ scale: 0 }))
        } else {
            resetValues()
        }
    }

    function onTouchCancel(event: TouchEvent): void {
        resetValues()
    }

    onMount(() => {
        eventTarget.addEventListener('touchstart', onTouchStart)
        eventTarget.addEventListener('touchmove', onTouchMove)
        eventTarget.addEventListener('touchend', onTouchEnd)
        eventTarget.addEventListener('touchcancel', onTouchCancel)
    })

    onDestroy(() => {
        eventTarget.removeEventListener('touchstart', onTouchStart)
        eventTarget.removeEventListener('touchmove', onTouchMove)
        eventTarget.removeEventListener('touchend', onTouchEnd)
        eventTarget.removeEventListener('touchcancel', onTouchCancel)
    })
</script>

{#if platform === 'ios'}
    <ios-refresher
        class:is-refreshing={isRefreshing}
        style:--position={$animationValues.position + 'px'}
        style:--scale={$animationValues.scale}
    >
        {#each Array(12) as _, i}
            <span
                class="bar"
                data-index={i}
                style:transform="rotate({i * 30}deg) translate(0, -130%)"
                style:animation-delay={-1 + i / 12 + 's'}
                hidden={!isRefreshing && (SWIPE_MAX / 3) * (i / 12) >= $animationValues.position - 30}
            />
        {/each}
    </ios-refresher>
{:else if platform === 'android'}
    <android-refresher
        class:is-refreshing={isRefreshing}
        style:--opacity={$animationValues.opacity}
        style:--position={$animationValues.position + 'px'}
        style:--rotation={$animationValues.rotation + 'deg'}
        style:--scale={$animationValues.scale}
        style:--color={tailwindConfig.theme.colors.blue[500]}
        style:--draw={'-' + $animationValues.draw + 'ms'}
        style:--arrow-scale={$animationValues.arrowScale}
    />
{/if}

<style type="text/scss">
    android-refresher,
    ios-refresher {
        align-items: center;
        background-color: #fbfaf8;
        border-radius: 50%;
        box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px;
        display: flex;
        height: 38px;
        justify-content: center;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        top: -48px;
        width: 38px;
        z-index: 999;
    }

    ios-refresher {
        transform: translateY(var(--position)) scale(var(--scale));

        .bar {
            background: #888;
            border-radius: 20px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
            height: 16%;
            left: 49%;
            opacity: 1;
            position: absolute;
            top: 43%;
            width: 4%;
        }

        &.is-refreshing .bar {
            animation: fade 1s linear infinite;
        }

        @keyframes fade {
            from {
                opacity: 1;
            }
            to {
                opacity: 0.25;
            }
        }
    }

    android-refresher {
        transform: translateY(var(--position)) rotateZ(var(--rotation)) scale(var(--scale));

        &::before {
            border-bottom: 5px solid var(--color);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            height: 0;
            margin-left: 11px;
            margin-top: 16px;
            position: absolute;
            transform: rotateZ(220deg) scale(var(--arrow-scale));
            width: 0;
        }

        &::after {
            animation: borderProgressIn 1000ms;
            animation-delay: var(--draw);
            animation-play-state: paused;
            border-radius: 50%;
            border: 3px solid var(--color);
            box-sizing: border-box;
            clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 60%);
            height: 22px;
            transform: rotateZ(max(calc(160deg + var(--rotation) * -1), -100deg));
            width: 22px;
        }

        &::after,
        &::before {
            content: '';
            display: block;
            opacity: var(--opacity);
        }

        @keyframes borderProgressIn {
            0% {
                clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
            }
            25% {
                clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
            }
            50% {
                clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
            }
            75% {
                clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
            }
            100% {
                clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 60%);
            }
        }

        &.is-refreshing {
            &::before {
                display: none;
            }

            &::after {
                animation: rotate 1.5s linear infinite, borderProgressInOut 1.5s linear infinite;
                border: 3px solid var(--color);
            }

            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            @keyframes borderProgressInOut {
                0% {
                    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
                }
                12.5% {
                    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
                }
                25% {
                    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
                }
                37.5% {
                    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
                }
                50% {
                    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
                }
                50.01% {
                    clip-path: polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 0, 0 0);
                }
                62.5% {
                    clip-path: polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 0, 100% 0);
                }
                75% {
                    clip-path: polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 100%, 100% 100%);
                }
                87.5% {
                    clip-path: polygon(50% 50%, 0 0, 0 100%, 0 100%, 0 100%, 0 100%);
                }
                100% {
                    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
                }
            }
        }
    }
</style>

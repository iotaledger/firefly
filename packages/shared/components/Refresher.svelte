<script lang="typescript">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { quintOut } from 'svelte/easing'
    import tailwindConfig from 'shared/tailwind.config.js'
    import { sleep } from '@lib/utils'

    export let platform = 'ios'
    export let callback = async (): Promise<void> => {}

    const swipeMax = window.screen.availHeight / 2

    const opacityEasing = (n: number) => Math.max(Math.min(positionEasing(n) / (swipeMax / 6) - 0.5, 1), 0.5)
    const positionEasing = (n: number) => (n * (Math.log(2 + (swipeMax - n) / swipeMax) / Math.log(2))) / 2
    const rotationEasing = (n: number) => (positionEasing(n) / (swipeMax / 6)) * 360 - 180
    const drawEasing = (n: number) => (positionEasing(n) / (swipeMax / 6)) * 1000 - 500
    const arrowScaleEasing = (n: number) => Math.min(positionEasing(n) / (swipeMax / 6) - 0.5, 1)

    let startY = 0
    let y = 0
    let isRefreshing = false

    const animationValues = tweened(
        {
            opacity: 0,
            position: 0,
            rotation: 0,
            scale: 1,
            draw: 0,
            arrowScale: 0,
        },
        {
            duration: 350,
            easing: quintOut,
        }
    )

    $: {
        if ($animationValues.scale === 0) {
            resetValues(0)
        }

        if (platform === 'ios' && $animationValues.position >= swipeMax / 2.5) {
            callRefresh().then(() => resetValues())
        }
    }

    function onTouchStart(event: TouchEvent): void {
        resetValues(0)
        startY = event.touches[0].clientY
    }

    function onTouchMove(event: TouchEvent): void {
        const clientY = event.touches[0].clientY
        y = clientY > swipeMax ? swipeMax : clientY
        const movedY = y - startY

        switch (platform) {
            case 'android':
                animationValues.set(
                    {
                        ...$animationValues,
                        opacity: opacityEasing(movedY),
                        position: positionEasing(movedY),
                        rotation: rotationEasing(movedY),
                        draw: drawEasing(movedY),
                        arrowScale: arrowScaleEasing(movedY),
                    },
                    {
                        duration: 0,
                    }
                )
                break
            case 'ios':
                animationValues.set(
                    {
                        ...$animationValues,
                        position: positionEasing(movedY),
                    },
                    {
                        duration: 0,
                    }
                )
                break
        }
    }

    function onTouchEnd(event: TouchEvent): void {
        if (platform === 'android' && $animationValues.opacity === 1) {
            callRefresh().then(() => resetValues(0))
        } else if (platform === 'ios' && isRefreshing) {
            $animationValues = { ...$animationValues, position: swipeMax / 8 }
        } else {
            resetValues()
        }
    }

    function onTouchCancel(event: TouchEvent): void {
        resetValues()
    }

    function resetValues(duration: number = 350): void {
        startY = 0
        y = 0
        animationValues.set(
            {
                opacity: 0,
                position: 0,
                rotation: 0,
                scale: 1,
                draw: 0,
                arrowScale: 0,
            },
            { duration }
        )
    }

    async function callRefresh(): Promise<void> {
        isRefreshing = true
        if (platform === 'android') {
            $animationValues = { ...$animationValues, position: swipeMax / 3 }
        }
        await callback()
        isRefreshing = false
        if (platform === 'android') {
            $animationValues = { ...$animationValues, scale: 0 }
        }
    }

    onMount(() => {
        window.addEventListener('touchstart', onTouchStart)
        window.addEventListener('touchmove', onTouchMove)
        window.addEventListener('touchend', onTouchEnd)
        window.addEventListener('touchcancel', onTouchCancel)
    })

    onDestroy(() => {
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchcancel', onTouchCancel)
    })
</script>

{#if platform === 'ios'}
    <ios-refresher
        class:is-refreshing={isRefreshing}
        style:--margin-bottom={$animationValues.position + 'px'}
        style:--margin-top={($animationValues.position > 54 ? 0 : $animationValues.position - 54) + 'px'}
    >
        {#each Array(12) as _, i}
            <span
                class="bar"
                data-index={i}
                style:transform="rotate({i * 30}deg) translate(0, -130%)"
                style:animation-delay={-1 + i / 12 + 's'}
                hidden={!isRefreshing && (swipeMax / 3) * (i / 12) >= $animationValues.position - 30}
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
    ios-refresher {
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        margin-bottom: var(--margin-bottom);
        margin-left: auto;
        margin-right: auto;
        margin-top: var(--margin-top);
        padding: 10px;
        position: relative;
        width: 54px;
        z-index: 999;

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

        &.is-refreshing {
            animation: scale 0.2s linear;

            .bar {
                animation: fade 1s linear infinite;
            }
        }

        @keyframes fade {
            from {
                opacity: 1;
            }
            to {
                opacity: 0.25;
            }
        }

        @keyframes scale {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.25);
            }
            100% {
                transform: scale(1);
            }
        }
    }

    android-refresher {
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
        transform: translateY(var(--position)) rotateZ(var(--rotation)) scale(var(--scale));
        width: 38px;
        z-index: 999;

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
                animation: borderProgressInOut 1.5s linear infinite, rotate 1.5s linear infinite;
                border: 3px solid var(--color);
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

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

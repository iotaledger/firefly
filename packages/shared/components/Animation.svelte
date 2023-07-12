<script lang="ts">
    import lottie, { AnimationItem, AnimationSegment } from 'lottie-web'
    import { appSettings } from '@core/app'
    import { onDestroy } from 'svelte'
    import { AnimationRenderer, AnimationEnum, ANIMATIONS } from '@auxiliary/animation'

    export let animation: AnimationEnum | undefined = undefined
    export let classes: string = ''
    export let loop: boolean = true
    export let autoplay: boolean = true
    export let segments: AnimationSegment | AnimationSegment[] | undefined = undefined
    export let renderer: AnimationRenderer = AnimationRenderer.Svg

    let container: HTMLElement
    let lottieAnimation: AnimationItem

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animation ? ANIMATIONS[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null

    $: if (selected && container) {
        const options = {
            container,
            renderer,
            path: `assets/animations/${selected}`,
            loop,
            autoplay,
        }
        destroyAnimation()
        lottieAnimation = lottie.loadAnimation(options)
    }

    $: if (lottieAnimation && segments) {
        lottieAnimation.removeEventListener('DOMLoaded', handleSegments)
        lottieAnimation.addEventListener('DOMLoaded', handleSegments)
    }

    function handleSegments(): void {
        if (segments) {
            lottieAnimation.playSegments(segments, true)
        }
    }

    function destroyAnimation(): void {
        if (lottieAnimation) {
            try {
                lottieAnimation.destroy()
            } catch (e) {
                console.error(e)
            }
        }
    }
    onDestroy(() => {
        if (lottieAnimation) {
            lottieAnimation.removeEventListener('DOMLoaded', handleSegments)
            destroyAnimation()
        }
    })
</script>

<animation class="w-full {classes}" bind:this={container} />

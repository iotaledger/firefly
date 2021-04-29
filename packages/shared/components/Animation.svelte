<script>
    import lottie from 'lottie-web'
    import { appSettings } from 'shared/lib/appSettings'
    import { onDestroy } from 'svelte'

    export let animation = undefined
    export let classes = ''
    export let loop = true
    export let autoplay = true
    export let segments = undefined
    export let renderer = 'svg'

    const animations = {
        'welcome-desktop': {
            lightmode: 'welcome-desktop.json',
            darkmode: 'welcome-desktop-darkmode.json',
        },
        'appearance-desktop': {
            lightmode: 'appearance-desktop.json',
            darkmode: 'appearance-desktop-darkmode.json',
        },
        'profile-desktop': {
            lightmode: 'profile-desktop.json',
            darkmode: 'profile-desktop-darkmode.json',
        },
        'setup-desktop': {
            lightmode: 'setup-desktop.json',
            darkmode: 'setup-desktop-darkmode.json',
        },
        'secure-desktop': {
            lightmode: 'secure-desktop.json',
            darkmode: 'secure-desktop-darkmode.json',
        },
        'password-desktop': {
            lightmode: 'password-desktop.json',
            darkmode: 'password-desktop-darkmode.json',
        },
        'protect-desktop': {
            lightmode: 'protect-desktop.json',
            darkmode: 'protect-desktop-darkmode.json',
        },
        'pin-desktop': {
            lightmode: 'pin-desktop.json',
            darkmode: 'pin-desktop-darkmode.json',
        },
        'repeat-pin-desktop': {
            lightmode: 'repeat-pin-desktop.json',
            darkmode: 'repeat-pin-desktop-darkmode.json',
        },
        'backup-desktop': {
            lightmode: 'backup-desktop.json',
            darkmode: 'backup-desktop-darkmode.json',
        },
        'backup-recovery-phrase-desktop': {
            lightmode: 'backup-recovery-phrase-desktop.json',
            darkmode: 'backup-recovery-phrase-desktop-darkmode.json',
        },
        'import-desktop': {
            lightmode: 'import-desktop.json',
            darkmode: 'import-desktop-darkmode.json',
        },
        'import-from-text-desktop': {
            lightmode: 'import-from-text-desktop.json',
            darkmode: 'import-from-text-desktop-darkmode.json',
        },
        'import-from-file-desktop': {
            lightmode: 'import-from-file-desktop.json',
            darkmode: 'import-from-file-desktop-darkmode.json',
        },
        'import-from-file-password-desktop': {
            lightmode: 'import-from-file-password-desktop.json',
            darkmode: 'import-from-file-password-desktop-darkmode.json',
        },
        'import-from-text-success-desktop': {
            lightmode: 'import-from-text-success-desktop.json',
            darkmode: 'import-from-text-success-desktop-darkmode.json',
        },
        'import-from-file-success-desktop': {
            lightmode: 'import-from-file-success-desktop.json',
            darkmode: 'import-from-file-success-desktop-darkmode.json',
        },
        'congratulations-desktop': {
            lightmode: 'congratulations-desktop.json',
            darkmode: 'congratulations-desktop-darkmode.json',
        },
        'migrate-desktop': {
            lightmode: 'migrate-desktop.json',
            darkmode: 'migrate-desktop-darkmode.json',
        },
        'balance-desktop': {
            lightmode: 'balance-desktop.json',
            darkmode: 'balance-desktop-darkmode.json',
        },
        'splashscreen-desktop': {
            lightmode: 'splashscreen-desktop.json',
            darkmode: 'splashscreen-desktop-darkmode.json',
        },
        'loading-desktop': {
            lightmode: 'loading-desktop.json',
            darkmode: 'loading-desktop.json',
        },
    }

    let container
    let lottieAnimation

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animations[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    $: if (selected && container) {
        let options = {
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

    function handleSegments() {
        if (segments) {
            lottieAnimation.playSegments(segments, true)
        }
    }

    function destroyAnimation() {
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

<div class="relative w-full {classes}" bind:this={container} />

<script>
    import { onDestroy } from 'svelte'
    import { appSettings } from 'shared/lib/appSettings'
    import lottie from 'lottie-web'

    export let animation = undefined
    export let classes = ''
    export let loop = true
    export let autoplay = true
    export let segments = undefined

    const animations = {
        'welcome-desktop': {
            lightmode: 'onboarding/welcome-desktop.json',
            darkmode: 'onboarding/welcome-desktop-darkmode.json',
        },
        'appearance-desktop': {
            lightmode: 'onboarding/appearance-desktop.json',
            darkmode: 'onboarding/appearance-desktop-darkmode.json',
        },
        'setup-desktop': {
            lightmode: 'onboarding/setup-desktop.json',
            darkmode: 'onboarding/setup-desktop-darkmode.json',
        },
        'secure-desktop': {
            lightmode: 'onboarding/secure-desktop.json',
            darkmode: 'onboarding/secure-desktop-darkmode.json',
        },
        'password-desktop': {
            lightmode: 'onboarding/password-desktop.json',
            darkmode: 'onboarding/password-desktop-darkmode.json',
        },
        'protect-desktop': {
            lightmode: 'onboarding/protect-desktop.json',
            darkmode: 'onboarding/protect-desktop-darkmode.json',
        },
        'pin-desktop': {
            lightmode: 'onboarding/pin-desktop.json',
            darkmode: 'onboarding/pin-desktop-darkmode.json',
        },
        'repeat-pin-desktop': {
            lightmode: 'onboarding/repeat-pin-desktop.json',
            darkmode: 'onboarding/repeat-pin-desktop-darkmode.json',
        },
        'backup-desktop': {
            lightmode: 'onboarding/backup-desktop.json',
            darkmode: 'onboarding/backup-desktop-darkmode.json',
        },
        'backup-recovery-phrase-desktop': {
            lightmode: 'onboarding/backup-recovery-phrase-desktop.json',
            darkmode: 'onboarding/backup-recovery-phrase-desktop-darkmode.json',
        },
        'import-desktop': {
            lightmode: 'onboarding/import-desktop.json',
            darkmode: 'onboarding/import-desktop-darkmode.json',
        },
        'import-from-text-desktop': {
            lightmode: 'onboarding/import-from-text-desktop.json',
            darkmode: 'onboarding/import-from-text-desktop-darkmode.json',
        },
        'import-from-file-desktop': {
            lightmode: 'onboarding/import-from-file-desktop.json',
            darkmode: 'onboarding/import-from-file-desktop-darkmode.json',
        },
        'import-from-file-password-desktop': {
            lightmode: 'onboarding/import-from-file-password-desktop.json',
            darkmode: 'onboarding/import-from-file-password-desktop-darkmode.json',
        },
        'import-from-text-success-desktop': {
            lightmode: 'onboarding/import-from-text-success-desktop.json',
            darkmode: 'onboarding/import-from-text-success-desktop-darkmode.json',
        },
        'import-from-file-success-desktop': {
            lightmode: 'onboarding/import-from-file-success-desktop.json',
            darkmode: 'onboarding/import-from-file-success-desktop-darkmode.json',
        },
        'congratulations-desktop': {
            lightmode: 'onboarding/congratulations-desktop.json',
            darkmode: 'onboarding/congratulations-desktop-darkmode.json',
        },
        'migrate-desktop': {
            lightmode: 'onboarding/migrate-desktop.json',
            darkmode: 'onboarding/migrate-desktop-darkmode.json',
        },
        'migrate-failed-desktop': {
            lightmode: 'onboarding/migrate-failed-desktop.json',
            darkmode: 'onboarding/migrate-failed-desktop-darkmode.json',
        },
        'balance-desktop': {
            lightmode: 'onboarding/balance-desktop.json',
            darkmode: 'onboarding/balance-desktop-darkmode.json',
        },
    }

    let container
    let lottieAnimation

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animations[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    $: if (selected && container) {
        let options = {
            container,
            renderer: 'svg',
            path: `assets/animations/${selected}`,
            loop,
            autoplay,
        }
        lottieAnimation && lottie.destroy()
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

    onDestroy(() => {
        if (lottieAnimation) {
            lottieAnimation.removeEventListener('DOMLoaded', handleSegments)
            lottieAnimation.destroy()
        }
    })
</script>

<div class="relative w-full{classes}" bind:this={container} />

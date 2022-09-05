<script lang="typescript">
    import lottie from 'lottie-web'
    import { appSettings } from '@core/app'
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
        'onboarding-protocol-desktop': {
            lightmode: '',
            darkmode: '',
        },
        'onboarding-network-desktop': {
            lightmode: '',
            darkmode: '',
        },
        'onboarding-custom-network-desktop': {
            lightmode: '',
            darkmode: '',
        },
        'profile-desktop': {
            lightmode: 'setup-desktop.json',
            darkmode: 'setup-desktop-darkmode.json',
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
        'success-desktop': {
            lightmode: 'success-desktop.json',
            darkmode: 'success-desktop-darkmode.json',
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
        'ledger-choose-index-desktop': {
            lightmode: 'ledger/ledger-choose-index-desktop.json',
            darkmode: 'ledger/ledger-choose-index-desktop-darkmode.json',
        },
        'ledger-bg-desktop': {
            lightmode: 'ledger/ledger-bg-desktop.json',
            darkmode: 'ledger/ledger-bg-desktop-darkmode.json',
        },
        'ledger-switch-app-desktop': {
            lightmode: 'ledger/ledger-switch-app-desktop.json',
            darkmode: 'ledger/ledger-switch-app-desktop.json',
        },
        'ledger-generate-address-desktop': {
            lightmode: 'ledger/ledger-generate-address-desktop.json',
            darkmode: 'ledger/ledger-generate-address-desktop.json',
        },
        'ledger-prompt-confirmed-desktop': {
            lightmode: 'ledger/ledger-prompt-confirmed-desktop.json',
            darkmode: 'ledger/ledger-prompt-confirmed-desktop.json',
        },
        'ledger-confirm-prompt-desktop': {
            lightmode: 'ledger/ledger-confirm-prompt-desktop.json',
            darkmode: 'ledger/ledger-confirm-prompt-desktop.json',
        },
        'ledger-connected-desktop': {
            lightmode: 'ledger/ledger-connected-desktop.json',
            darkmode: 'ledger/ledger-connected-desktop.json',
        },
        'ledger-disconnected-desktop': {
            lightmode: 'ledger/ledger-disconnected-desktop.json',
            darkmode: 'ledger/ledger-disconnected-desktop.json',
        },
        'ledger-app-closed-desktop': {
            lightmode: 'ledger/ledger-app-closed-desktop.json',
            darkmode: 'ledger/ledger-app-closed-desktop.json',
        },
        // Staking
        'staking-prestaking': {
            lightmode: 'staking/prestaking.json',
            darkmode: 'staking/prestaking.json',
        },
        'staking-staking-neither': {
            lightmode: 'staking/staking-neither.json',
            darkmode: 'staking/staking-neither.json',
        },
        'staking-staking-both': {
            lightmode: 'staking/staking-both.json',
            darkmode: 'staking/staking-both.json',
        },
        'staking-staking-assembly-with-shimmer-rewards': {
            lightmode: 'staking/staking-assembly-with-shimmer-rewards.json',
            darkmode: 'staking/staking-assembly-with-shimmer-rewards.json',
        },
        'staking-staking-assembly-without-shimmer-rewards': {
            lightmode: 'staking/staking-assembly-without-shimmer-rewards.json',
            darkmode: 'staking/staking-assembly-without-shimmer-rewards.json',
        },
        'staking-staking-shimmer-with-assembly-rewards': {
            lightmode: 'staking/staking-shimmer-with-assembly-rewards.json',
            darkmode: 'staking/staking-shimmer-with-assembly-rewards.json',
        },
        'staking-staking-shimmer-without-assembly-rewards': {
            lightmode: 'staking/staking-shimmer-without-assembly-rewards.json',
            darkmode: 'staking/staking-shimmer-without-assembly-rewards.json',
        },
        'staking-ended': {
            lightmode: 'staking/ended.json',
            darkmode: 'staking/ended.json',
        },
        'special-token': {
            lightmode: 'special-token.json',
            darkmode: 'special-token.json',
        },
    }

    let container
    let lottieAnimation

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animations[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

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

<animation class="w-full {classes}" bind:this={container} />

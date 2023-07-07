<script lang="ts">
    import lottie, { AnimationItem, AnimationSegment } from 'lottie-web'
    import { appSettings } from '@core/app'
    import { onDestroy } from 'svelte'
    import { Animation as AnimationEnum, AnimationRenderer, IAnimation } from '@auxiliary/animation'

    export let animation: string | undefined = undefined
    export let classes = ''
    export let loop: boolean = true
    export let autoplay: boolean = true
    export let segments: AnimationSegment | AnimationSegment[] | undefined = undefined
    export let renderer: AnimationRenderer = AnimationRenderer.Svg

    const animations: IAnimation = {
        [AnimationEnum.WelcomeDeskop]: {
            lightmode: 'welcome-desktop.json',
            darkmode: 'welcome-desktop-darkmode.json',
        },
        [AnimationEnum.AppearanceDesktop]: {
            lightmode: 'appearance-desktop.json',
            darkmode: 'appearance-desktop-darkmode.json',
        },
        [AnimationEnum.OnboardingProtocolDesktop]: {
            lightmode: 'onboarding-desktop.json',
            darkmode: 'onboarding-desktop-darkmode.json',
        },
        [AnimationEnum.OnboardingNetworkDesktop]: {
            lightmode: 'onboarding-desktop.json',
            darkmode: 'onboarding-desktop-darkmode.json',
        },
        [AnimationEnum.OnboardingCustomNetworkDesktop]: {
            lightmode: 'onboarding-desktop.json',
            darkmode: 'onboarding-desktop-darkmode.json',
        },
        [AnimationEnum.ProfileDesktop]: {
            lightmode: 'setup-desktop.json',
            darkmode: 'setup-desktop-darkmode.json',
        },
        [AnimationEnum.SetupDesktop]: {
            lightmode: 'setup-desktop.json',
            darkmode: 'setup-desktop-darkmode.json',
        },
        [AnimationEnum.SecureDesktop]: {
            lightmode: 'secure-desktop.json',
            darkmode: 'secure-desktop-darkmode.json',
        },
        [AnimationEnum.PasswordDesktop]: {
            lightmode: 'password-desktop.json',
            darkmode: 'password-desktop-darkmode.json',
        },
        [AnimationEnum.ProtectDesktop]: {
            lightmode: 'protect-desktop.json',
            darkmode: 'protect-desktop-darkmode.json',
        },
        [AnimationEnum.PinDesktop]: {
            lightmode: 'pin-desktop.json',
            darkmode: 'pin-desktop-darkmode.json',
        },
        [AnimationEnum.RepeatPinDesktop]: {
            lightmode: 'repeat-pin-desktop.json',
            darkmode: 'repeat-pin-desktop-darkmode.json',
        },
        [AnimationEnum.BackupDesktop]: {
            lightmode: 'backup-desktop.json',
            darkmode: 'backup-desktop-darkmode.json',
        },
        [AnimationEnum.BackupRecoveryPhraseDesktop]: {
            lightmode: 'backup-recovery-phrase-desktop.json',
            darkmode: 'backup-recovery-phrase-desktop-darkmode.json',
        },
        [AnimationEnum.ImportDesktop]: {
            lightmode: 'import-desktop.json',
            darkmode: 'import-desktop-darkmode.json',
        },
        [AnimationEnum.ImportFromTextDesktop]: {
            lightmode: 'import-from-text-desktop.json',
            darkmode: 'import-from-text-desktop-darkmode.json',
        },
        [AnimationEnum.ImportFromFileDesktop]: {
            lightmode: 'import-from-file-desktop.json',
            darkmode: 'import-from-file-desktop-darkmode.json',
        },
        [AnimationEnum.ImportFromFilePasswordDesktop]: {
            lightmode: 'import-from-file-password-desktop.json',
            darkmode: 'import-from-file-password-desktop-darkmode.json',
        },
        [AnimationEnum.SuccessDesktop]: {
            lightmode: 'success-desktop.json',
            darkmode: 'success-desktop-darkmode.json',
        },
        [AnimationEnum.CongratulationsDesktop]: {
            lightmode: 'congratulations-desktop.json',
            darkmode: 'congratulations-desktop-darkmode.json',
        },
        [AnimationEnum.MigrateDesktop]: {
            lightmode: 'migrate-desktop.json',
            darkmode: 'migrate-desktop-darkmode.json',
        },
        [AnimationEnum.BalanceDesktop]: {
            lightmode: 'balance-desktop.json',
            darkmode: 'balance-desktop-darkmode.json',
        },
        [AnimationEnum.SplashscreenDesktop]: {
            lightmode: 'splashscreen-desktop.json',
            darkmode: 'splashscreen-desktop-darkmode.json',
        },
        [AnimationEnum.LoadingDesktop]: {
            lightmode: 'loading-desktop.json',
            darkmode: 'loading-desktop.json',
        },
        [AnimationEnum.LedgerBgDesktop]: {
            lightmode: 'ledger/ledger-bg-desktop.json',
            darkmode: 'ledger/ledger-bg-desktop-darkmode.json',
        },
        [AnimationEnum.LedgerPromptConfirmedDesktop]: {
            lightmode: 'ledger/ledger-prompt-confirmed-desktop.json',
            darkmode: 'ledger/ledger-prompt-confirmed-desktop.json',
        },
        [AnimationEnum.LedgerConfirmPromptDesktop]: {
            lightmode: 'ledger/ledger-confirm-prompt-desktop.json',
            darkmode: 'ledger/ledger-confirm-prompt-desktop.json',
        },
        [AnimationEnum.LedgerConnectedDesktop]: {
            lightmode: 'ledger/ledger-connected-desktop.json',
            darkmode: 'ledger/ledger-connected-desktop.json',
        },
        [AnimationEnum.LedgerDisconnectedDesktop]: {
            lightmode: 'ledger/ledger-disconnected-desktop.json',
            darkmode: 'ledger/ledger-disconnected-desktop.json',
        },
        [AnimationEnum.LedgerAppClosedDesktop]: {
            lightmode: 'ledger/ledger-app-closed-desktop.json',
            darkmode: 'ledger/ledger-app-closed-desktop.json',
        },
        [AnimationEnum.StakingPrestaking]: {
            lightmode: 'staking/prestaking.json',
            darkmode: 'staking/prestaking.json',
        },
        [AnimationEnum.StakingStakingNeither]: {
            lightmode: 'staking/staking-neither.json',
            darkmode: 'staking/staking-neither.json',
        },
        [AnimationEnum.StakingStakingBoth]: {
            lightmode: 'staking/staking-both.json',
            darkmode: 'staking/staking-both.json',
        },
        [AnimationEnum.StakingStakingAssemblyWithShimmerRewards]: {
            lightmode: 'staking/staking-assembly-with-shimmer-rewards.json',
            darkmode: 'staking/staking-assembly-with-shimmer-rewards.json',
        },
        [AnimationEnum.StakingStakingAssemblyWithoutShimmerRewards]: {
            lightmode: 'staking/staking-assembly-without-shimmer-rewards.json',
            darkmode: 'staking/staking-assembly-without-shimmer-rewards.json',
        },
        [AnimationEnum.StakingStakingShimmerWithAssemblyRewards]: {
            lightmode: 'staking/staking-shimmer-with-assembly-rewards.json',
            darkmode: 'staking/staking-shimmer-with-assembly-rewards.json',
        },
        [AnimationEnum.StakingStakingShimmerWithoutAssemblyRewards]: {
            lightmode: 'staking/staking-shimmer-without-assembly-rewards.json',
            darkmode: 'staking/staking-shimmer-without-assembly-rewards.json',
        },
        [AnimationEnum.StakingEnded]: {
            lightmode: 'staking/ended.json',
            darkmode: 'staking/ended.json',
        },
        [AnimationEnum.SpecialToken]: {
            lightmode: 'special-token.json',
            darkmode: 'special-token.json',
        },
    }

    let container: HTMLElement
    let lottieAnimation: AnimationItem

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animation ? animations[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null

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

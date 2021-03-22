<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'

    export let illustration = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustrations[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    const illustrations = {
        'welcome-desktop': {
            lightmode: 'onboarding/welcome-desktop.svg',
            darkmode: 'onboarding/welcome-desktop-darkmode.svg',
        },
        'appearance-desktop': {
            lightmode: 'onboarding/appearance-desktop.svg',
            darkmode: 'onboarding/appearance-desktop-darkmode.svg',
        },
        'setup-desktop': {
            lightmode: 'onboarding/setup-desktop.svg',
            darkmode: 'onboarding/setup-desktop-darkmode.svg',
        },
        'secure-desktop': {
            lightmode: 'onboarding/secure-desktop.svg',
            darkmode: 'onboarding/secure-desktop-darkmode.svg',
        },
        'password-desktop': {
            lightmode: 'onboarding/password-desktop.svg',
            darkmode: 'onboarding/password-desktop-darkmode.svg',
        },
        'protect-desktop': {
            lightmode: 'onboarding/protect-desktop.svg',
            darkmode: 'onboarding/protect-desktop-darkmode.svg',
        },
        'pin-desktop': {
            lightmode: 'onboarding/pin-desktop.svg',
            darkmode: 'onboarding/pin-desktop-darkmode.svg',
        },
        'repeat-pin-desktop': {
            lightmode: 'onboarding/repeat-pin-desktop.svg',
            darkmode: 'onboarding/repeat-pin-desktop-darkmode.svg',
        },
        'backup-desktop': {
            lightmode: 'onboarding/backup-desktop.svg',
            darkmode: 'onboarding/backup-desktop-darkmode.svg',
        },
        'backup-recovery-phrase-desktop': {
            lightmode: 'onboarding/backup-recovery-phrase-desktop.svg',
            darkmode: 'onboarding/backup-recovery-phrase-desktop-darkmode.svg',
        },
        'import-desktop': {
            lightmode: 'onboarding/import-desktop.svg',
            darkmode: 'onboarding/import-desktop-darkmode.svg',
        },
        'import-from-text-desktop': {
            lightmode: 'onboarding/import-from-text-desktop.svg',
            darkmode: 'onboarding/import-from-text-desktop-darkmode.svg',
        },
        'import-from-file-desktop': {
            lightmode: 'onboarding/import-from-file-desktop.svg',
            darkmode: 'onboarding/import-from-file-desktop-darkmode.svg',
        },
        'import-from-file-password-desktop': {
            lightmode: 'onboarding/import-from-file-password-desktop.svg',
            darkmode: 'onboarding/import-from-file-password-desktop-darkmode.svg',
        },
        'import-from-text-success-desktop': {
            lightmode: 'onboarding/import-from-text-success-desktop.svg',
            darkmode: 'onboarding/import-from-text-success-desktop-darkmode.svg',
        },
        'import-from-file-success-desktop': {
            lightmode: 'onboarding/import-from-file-success-desktop.svg',
            darkmode: 'onboarding/import-from-file-success-desktop-darkmode.svg',
        },
        'congratulations-desktop': {
            lightmode: 'onboarding/congratulations-desktop.svg',
            darkmode: 'onboarding/congratulations-desktop-darkmode.svg',
        },
        'migrate-desktop': {
            lightmode: 'onboarding/migrate-desktop.svg',
            darkmode: 'onboarding/migrate-desktop-darkmode.svg',
        },
        'migrate-failed-desktop': {
            lightmode: 'onboarding/migrate-failed-desktop.svg',
            darkmode: 'onboarding/migrate-failed-desktop-darkmode.svg',
        },
        'balance-desktop': {
            lightmode: 'onboarding/balance-desktop.svg',
            darkmode: 'onboarding/balance-desktop-darkmode.svg',
        },
    }
</script>

{#if selected}
    <img
        data-label="illustration"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/illustrations/${selected}`}
        alt="" />
{:else}
    <div class={`${classes}`} width={width || '100%'} height={height || '100%'} />
{/if}

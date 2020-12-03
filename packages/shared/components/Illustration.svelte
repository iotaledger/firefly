<script>
    export let illustration = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: selected = illustrations[illustration]

    const illustrations = {
        'welcome-1-desktop': 'onboarding/welcome-1-desktop.svg',
        'settings-desktop': 'onboarding/settings-desktop.svg',
        'setup-desktop': 'onboarding/setup-desktop.svg',
        'password-desktop': 'onboarding/password-desktop.svg',
        'protect-desktop': 'onboarding/protect-desktop.svg',
        'pin-desktop': 'onboarding/pin-desktop.svg',
        'repeat-pin-desktop': 'onboarding/repeat-pin-desktop.svg',
        'backup-desktop': 'onboarding/backup-desktop.svg',
        'backup-recovery-phrase-desktop': 'onboarding/backup-recovery-phrase-desktop.svg',
        'import-desktop': 'onboarding/import-desktop.svg',
        'import-from-text-desktop': 'onboarding/import-from-text-desktop.svg',
        'import-from-file-desktop': 'onboarding/import-from-file-desktop.svg',
        'import-from-file-password-desktop': 'onboarding/import-from-file-password-desktop.svg',
        'congratulations-desktop': 'onboarding/congratulations-desktop.svg',
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

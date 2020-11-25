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
        'congratulations-desktop': 'onboarding/congratulations-desktop.svg',
        'password-desktop': 'protect/password-desktop.svg',
        'protect-desktop': 'protect/protect-desktop.svg',
        'pin-desktop': 'protect/pin-desktop.svg',
        'repeat-pin-desktop': 'protect/repeat-pin-desktop.svg',
        'backup-desktop': 'backup/backup-desktop.svg',
        'backup-recovery-phrase-desktop': 'backup/backup-recovery-phrase-desktop.svg',
        'import-desktop': 'import/import-desktop.svg',
        'import-from-seed-desktop': 'import/import-from-seed-desktop.svg',
        'import-from-recovery-phrase-desktop': 'import/import-from-recovery-phrase-desktop.svg',
        'import-from-recovery-phrase-file-desktop': 'import/import-from-recovery-phrase-file-desktop.svg',
        'balance-desktop': 'import/balance-desktop.svg',
        'migrate-desktop': 'migrate/migrate-desktop.svg',
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

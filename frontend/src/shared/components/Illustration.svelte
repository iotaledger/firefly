<script>
    export let illustration = null
    export let width = null
    export let height = null
    export let classes = null

    $: selected = illustrations[illustration]

    const illustrations = {
        'onboarding-1-mobile': 'onboarding/onboarding-1-desktop.svg',
        'onboarding-1-desktop': 'onboarding/onboarding-1-desktop.svg',
        'congratulations-desktop': 'onboarding/congratulations-desktop.svg',
        'setup-desktop': 'setup/setup-desktop.svg',
        'password-desktop': 'protect/password-desktop.svg',
        'protect-desktop': 'protect/protect-desktop.svg',
        'pin-desktop': 'protect/pin-desktop.svg',
        'repeat-pin-desktop': 'protect/repeat-pin-desktop.svg',
        'backup-desktop': 'backup/backup-desktop.svg',
        'backup-recovery-phrase-desktop': 'backup/backup-recovery-phrase-desktop.svg',
        'import-desktop': 'import/import-desktop.svg',
    }
</script>

{#if selected}
    <img class={classes} width={width || '100%'} height={height || '100%'} src={`../assets/illustrations/${selected}`} alt="" />
{:else}
    <div class={`${classes}`} width={width || '100%'} height={height || '100%'} />
{/if}

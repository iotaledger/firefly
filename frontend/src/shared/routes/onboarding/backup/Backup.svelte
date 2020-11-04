<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Backup, RecoveryPhrase, VerifyRecoveryPhrase, BackupToFile, Success } from './views/'
    import { mnemonic } from '@shared-lib/app'
    import { strongholdPassword } from '@shared-lib/app'
    export let locale
    export let mobile

    enum BackupState {
        Init = 'init',
        RecoveryPhrase = 'recoveryPhrase',
        Verify = 'verify',
        Backup = 'backup',
        Success = 'success',
    }

    const dispatch = createEventDispatcher()

    let state: BackupState = BackupState.Init

    const _next = (event) => {
        let params = event.detail || {}
        switch (state) {
            case BackupState.Init:
                dispatch('requestMnemonic')
                state = BackupState.RecoveryPhrase
                break
            case BackupState.RecoveryPhrase:
                const { options } = params
                if (options === 'verify') {
                    state = BackupState.Verify
                } else if (options === 'backup') {
                    state = BackupState.Backup
                }
                break
            case BackupState.Backup:
                state = BackupState.Success
                break
            case BackupState.Verify:
            case BackupState.Success:
                dispatch('next')
                break
        }
    }
</script>

{#if state === BackupState.Init}
    <Backup on:next={_next} {locale} {mobile} />
{:else if state === BackupState.RecoveryPhrase}
    <RecoveryPhrase on:next={_next} mnemonic={$mnemonic} {locale} {mobile} />
{:else if state === BackupState.Verify}
    <VerifyRecoveryPhrase on:next={_next} mnemonic={$mnemonic} {locale} {mobile} />
{:else if state === BackupState.Backup}
    <BackupToFile on:next={_next} strongholdPassword={$strongholdPassword} {locale} {mobile} />
{:else if state === BackupState.Success}
    <Success on:next={_next} mnemonic={$mnemonic} {locale} {mobile} />
{/if}

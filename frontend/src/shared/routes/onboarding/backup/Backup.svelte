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
    let stateHistory = []

    const _next = (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case BackupState.Init:
                dispatch('requestMnemonic')
                nextState = BackupState.RecoveryPhrase
                break
            case BackupState.RecoveryPhrase:
                const { options } = params
                if (options === 'verify') {
                    nextState = BackupState.Verify
                } else if (options === 'backup') {
                    nextState = BackupState.Backup
                }
                break
            case BackupState.Backup:
                nextState = BackupState.Success
                break
            case BackupState.Verify:
            case BackupState.Success:
                dispatch('next')
                break
        }
        if (nextState) {
            stateHistory.push(nextState)
            stateHistory = stateHistory
            state = nextState
        }
    }

    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            state = prevState
        } else {
            dispatch('previous')
        }
    }
</script>

{#if state === BackupState.Init}
    <Backup on:next={_next} on:previous={_previous} {locale} {mobile} />
{:else if state === BackupState.RecoveryPhrase}
    <RecoveryPhrase on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
{:else if state === BackupState.Verify}
    <VerifyRecoveryPhrase on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
{:else if state === BackupState.Backup}
    <BackupToFile on:next={_next} on:previous={_previous} strongholdPassword={$strongholdPassword} {locale} {mobile} />
{:else if state === BackupState.Success}
    <Success on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
{/if}

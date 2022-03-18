<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic, strongholdPassword } from 'shared/lib/app'
    import { Platform } from 'shared/lib/platform'
    import { showAppNotification } from 'shared/lib/notifications'
    import { updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { asyncBackup, asyncCreateAccount, asyncStoreMnemonic, requestMnemonic } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Backup, BackupToFile, RecoveryPhrase, VerifyRecoveryPhrase } from './views/'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    enum BackupState {
        Init = 'init',
        RecoveryPhrase = 'recoveryPhrase',
        Verify = 'verify',
        Backup = 'backup',
    }

    const dispatch = createEventDispatcher()

    let state: BackupState = BackupState.Init
    let stateHistory = []
    let busy = false

    const _next = async (event) => {
        let nextState
        const params = event.detail || {}

        switch (state) {
            case BackupState.Init:
                try {
                    busy = true

                    await requestMnemonic()
                } catch (err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                } finally {
                    busy = false
                }
                nextState = BackupState.RecoveryPhrase
                break

            case BackupState.RecoveryPhrase:
                nextState = BackupState.Verify
                break

            case BackupState.Verify:
                nextState = BackupState.Backup
                break

            case BackupState.Backup:
                try {
                    const { skip } = params

                    if (skip) {
                        busy = true
                        await asyncStoreMnemonic(get(mnemonic).join(' '))
                        await asyncCreateAccount()
                        dispatch('next')
                    } else {
                        const dest = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
                        if (dest) {
                            busy = true
                            await asyncStoreMnemonic(get(mnemonic).join(' '))
                            await asyncCreateAccount()
                            await asyncBackup(dest, get(strongholdPassword))
                            updateProfile('lastStrongholdBackupTime', new Date())
                            dispatch('next')
                        }
                    }
                } catch (err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                } finally {
                    busy = false
                }
                break
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }

    const _previous = () => {
        const prevState = stateHistory.pop()
        if (prevState) {
            state = prevState
        } else {
            dispatch('previous')
        }
    }
</script>

{#if state === BackupState.Init}
    <Transition>
        <Backup on:next={_next} on:previous={_previous} {busy} {locale} />
    </Transition>
{:else if state === BackupState.RecoveryPhrase}
    <Transition>
        <RecoveryPhrase on:next={_next} on:previous={_previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if state === BackupState.Verify}
    <Transition>
        <VerifyRecoveryPhrase on:next={_next} on:previous={_previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if state === BackupState.Backup}
    <Transition>
        <BackupToFile
            on:next={_next}
            on:previous={_previous}
            {busy}
            strongholdPassword={$strongholdPassword}
            {locale}
        />
    </Transition>
{/if}

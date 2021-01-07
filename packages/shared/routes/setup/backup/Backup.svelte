<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Backup, RecoveryPhrase, VerifyRecoveryPhrase, BackupToFile, Success } from './views/'
    import { Transition } from 'shared/components'
    import { mnemonic } from 'shared/lib/app'
    import { strongholdPassword } from 'shared/lib/app'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'

    export let locale
    export let mobile

    enum BackupState {
        Init = 'init',
        RecoveryPhrase = 'recoveryPhrase',
        Verify = 'verify',
        Backup = 'backup',
        Success = 'success'
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
                window['Electron']
                    .getStrongholdBackupDestination()
                    .then((result) => {
                        if (result) {
                            api.backup(result, {
                                onSuccess() {
                                    nextState = BackupState.Success
                                },
                                onError(error) {
                                    console.error(error)
                                }
                            })
                        }
                    })
                    .catch(console.error)

            // break
            case BackupState.Verify:
            case BackupState.Success:
                api.storeMnemonic((get(mnemonic) as string[]).join(' '), {
                    onSuccess(response) {
                        api.createAccount(
                            {
                                clientOptions: { node, nodes },
                                signerType: {
                                    type: 'Stronghold'
                                }
                            },
                            {
                                onSuccess() {
                                    dispatch('next')
                                },
                                onError() {
                                    // TODO: handle error
                                    alert('create account error')
                                }
                            }
                        )
                    },
                    onError(error) {
                        console.log(error)
                    }
                })

                break
        }
        if (nextState) {
            stateHistory.push(state)
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
    <Transition>
        <Backup on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === BackupState.RecoveryPhrase}
    <Transition>
        <RecoveryPhrase on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
    </Transition>
{:else if state === BackupState.Verify}
    <Transition>
        <VerifyRecoveryPhrase on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
    </Transition>
{:else if state === BackupState.Backup}
    <Transition>
        <BackupToFile on:next={_next} on:previous={_previous} strongholdPassword={$strongholdPassword} {locale} {mobile} />
    </Transition>
{:else if state === BackupState.Success}
    <Transition>
        <Success on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
    </Transition>
{/if}

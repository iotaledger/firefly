<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic, strongholdPassword } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { DEFAULT_NODE, DEFAULT_NODES, network } from 'shared/lib/network'
    import { updateProfile } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Backup, BackupToFile, RecoveryPhrase, Success, VerifyRecoveryPhrase } from './views/'
    import { showAppNotification } from 'shared/lib/notifications'

    export let locale
    export let mobile

    let loading = false

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

    const _next = async (event) => {
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
                try {
                    await new Promise<void>((resolve, reject) => {
                        api.storeMnemonic(get(mnemonic).join(' '), {
                            onSuccess() {
                                resolve()
                            },
                            onError(error) {
                                reject(error)
                            },
                        })
                    })
                        .then(() => Electron.getStrongholdBackupDestination())
                        .then((result) => {
                            if (result) {
                                return new Promise<void>((res, rej) => {
                                    api.backup(result, {
                                        onSuccess() {
                                            updateProfile('lastStrongholdBackupTime', new Date())
                                            res()
                                        },
                                        onError(error) {
                                            rej(error)
                                        },
                                    })
                                })
                            }

                            throw new Error('Path not selected.')
                        })
                    nextState = BackupState.Success
                } catch (error) {
                    console.log('Error', error)
                }

                break
            case BackupState.Verify:
            case BackupState.Success:
                const _mnemonic = get(mnemonic).join(' ')
                loading = true

                // TODO: Instead of generated mnemonic, we should construct the phrase with what was chosen by the user
                api.verifyMnemonic(_mnemonic, {
                    onSuccess(response) {
                        api.storeMnemonic(_mnemonic, {
                            onSuccess(response) {
                                api.createAccount(
                                    {
                                        signerType: { type: 'Stronghold' },
                                        clientOptions: {
                                            node: DEFAULT_NODE,
                                            nodes: DEFAULT_NODES,
                                            network: $network,
                                        },
                                    },
                                    {
                                        onSuccess() {
                                            // Clear mnemonic
                                            mnemonic.set(null);
                                            dispatch('next')
                                        },
                                        onError(err) {
                                            showAppNotification({
                                                type: 'error',
                                                message: locale(err.error),
                                            })
                                            loading = false
                                        },
                                    }
                                )
                            },
                            onError(err) {
                                showAppNotification({
                                    type: 'error',
                                    message: locale(err.error),
                                })
                                loading = false
                            },
                        })
                    },
                    onError(err) {
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
                        })
                        loading = false
                    },
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
        <VerifyRecoveryPhrase {loading} on:next={_next} on:previous={_previous} mnemonic={$mnemonic} {locale} {mobile} />
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

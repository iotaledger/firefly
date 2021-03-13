<script lang="typescript">
    import { Transition } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { activeProfile } from 'shared/lib/profile'
    import { validatePinFormat } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Pin, Protect } from './views/'
    import { showAppNotification } from 'shared/lib/notifications'
    import { walletSetupType } from 'shared/lib/router'
    import { mnemonic } from 'shared/lib/app'
    import { DEFAULT_NODE, DEFAULT_NODES, network } from 'shared/lib/network'
    import { SetupType } from 'shared/lib/typings/routes'

    export let locale
    export let mobile

    let isVerifyingPin = false

    enum ProtectState {
        Init = 'init',
        Biometric = 'biometric',
        Pin = 'pin',
        Confirm = 'confirm',
    }

    const dispatch = createEventDispatcher()

    let state: ProtectState = ProtectState.Pin
    let stateHistory = []

    let pin = null

    // Reset variables based on state
    $: switch (state) {
        case ProtectState.Init:
        case ProtectState.Pin:
            pin = null
            break
    }

    // Initialises wallet from imported mnemonic
    // Verifies mnemonic syntactically
    // Stores mnemonic
    // Creates first account
    function initialiseWallet(input: string): Promise<void> {        
        return new Promise((resolve, reject) => {
            api.verifyMnemonic(input, {
                onSuccess() {
                    api.storeMnemonic(input, {
                        onSuccess() {
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
                                        resolve()
                                    },
                                    onError(error) {
                                        reject(error)
                                    },
                                }
                            )
                        },
                        onError(error) {
                            reject(error)
                        },
                    })
                },
                onError(error) {
                    reject(error)
                },
            })
        })
    }

    const _next = async (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case ProtectState.Init:
                const { type } = params
                if (type === 'pin') {
                    nextState = ProtectState.Pin
                } else if (type === 'biometric') {
                    nextState = ProtectState.Biometric
                }
                break
            case ProtectState.Pin:
                const { pinCandidate } = params
                pin = pinCandidate
                nextState = ProtectState.Confirm
                break
            case ProtectState.Confirm:
                try {
                    isVerifyingPin = true

                    if (!validatePinFormat(pin)) {
                        throw new Error('Invalid pin code!')
                    }

                    await Electron.PincodeManager.set(get(activeProfile)?.id, pin)

                    api.setStoragePassword(pin, {
                        async onSuccess() {
                            if ($walletSetupType === SetupType.Mnemonic) {
                                await initialiseWallet(get(mnemonic).join(' '))
                                
                                // Clear mnemonic
                                mnemonic.set(null)
                                dispatch('next', { pin })
                            } else {
                                dispatch('next', { pin })
                            }

                            isVerifyingPin = false
                        },
                        onError(err) {
                            isVerifyingPin = false
                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                        },
                    })
                    break
                } catch (error) {
                    isVerifyingPin = false
                    console.error(error)
                }
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

<!-- TODO: Readd Protect Init page
    
#if state === ProtectState.Init || state === ProtectState.Biometric}
    <Transition>
        <Protect on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{/if}-->

{#if state === ProtectState.Pin || state === ProtectState.Confirm}
    <Transition>
        <Pin loading={isVerifyingPin} on:next={_next} on:previous={_previous} pinCandidate={pin} {locale} {mobile} />
    </Transition>
{/if}

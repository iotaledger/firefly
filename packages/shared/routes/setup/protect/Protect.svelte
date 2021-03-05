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

    export let locale
    export let mobile

    enum ProtectState {
        Init = 'init',
        Biometric = 'biometric',
        Pin = 'pin',
        Confirm = 'confirm',
    }

    const dispatch = createEventDispatcher()

    let state: ProtectState = ProtectState.Init
    let stateHistory = []

    let pin = null

    // Reset variables based on state
    $: switch (state) {
        case ProtectState.Init:
        case ProtectState.Pin:
            pin = null
            break
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
                    if (!validatePinFormat(pin)) {
                        throw new Error('Invalid pin code!')
                    }

                    await Electron.PincodeManager.set(get(activeProfile).id, pin)

                    api.setStoragePassword(pin, {
                        onSuccess() {
                            dispatch('next', { pin })
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                        },
                    })
                    break
                } catch (error) {
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

{#if state === ProtectState.Init || state === ProtectState.Biometric}
    <Transition>
        <Protect on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ProtectState.Pin || state === ProtectState.Confirm}
    <Transition>
        <Pin on:next={_next} on:previous={_previous} pinCandidate={pin} {locale} {mobile} />
    </Transition>
{/if}

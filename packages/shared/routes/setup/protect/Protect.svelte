<script lang="typescript">
    import { Transition } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { activeProfile } from 'shared/lib/profile'
    import { validatePinFormat } from 'shared/lib/utils'
    import { asyncSetStoragePassword, asyncVerifyMnemonic, asyncStoreMnemonic, asyncCreateAccount } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Pin, RepeatPin } from './views/'
    import { showAppNotification } from 'shared/lib/notifications'
    import { walletSetupType } from 'shared/lib/router'
    import { mnemonic } from 'shared/lib/app'
    import { SetupType } from 'shared/lib/typings/routes'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let busy = false

    enum ProtectState {
        Init = 'init',
        Biometric = 'biometric',
        Pin = 'pin',
        RepeatPin = 'repeatPin',
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

    const _next = async (event) => {
        let nextState
        const params = event.detail || {}
        const { pinCandidate, type } = params

        switch (state) {
            case ProtectState.Init:
                if (type === 'pin') {
                    nextState = ProtectState.Pin
                } else if (type === 'biometric') {
                    nextState = ProtectState.Biometric
                }
                break
            case ProtectState.Pin:
                pin = pinCandidate
                nextState = ProtectState.RepeatPin
                break
            case ProtectState.RepeatPin:
                try {
                    busy = true

                    if (!validatePinFormat(pin)) {
                        throw new Error('Invalid pin code!')
                    }

                    await Platform.PincodeManager.set(get(activeProfile)?.id, pin)
                    await asyncSetStoragePassword(pin)

                    if ($walletSetupType === SetupType.Mnemonic) {
                        const m = get(mnemonic).join(' ')
                        await asyncVerifyMnemonic(m)
                        await asyncStoreMnemonic(m)
                        await asyncCreateAccount()

                        mnemonic.set(null)

                        dispatch('next', { pin })
                    } else {
                        dispatch('next', { pin })
                    }
                    break
                } catch (err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                } finally {
                    busy = false
                }
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

<!-- TODO: Readd Protect Init page
    
#if state === ProtectState.Init || state === ProtectState.Biometric}
    <Transition>
        <Protect on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{/if}-->

{#if state === ProtectState.Pin}
    <Transition>
        <Pin {busy} on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if state === ProtectState.RepeatPin}
    <Transition>
        <RepeatPin {busy} on:next={_next} on:previous={_previous} pinCandidate={pin} {locale} />
    </Transition>
{/if}

<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Transition } from 'shared/components'
    import { Protect, Pin } from './views/'
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

    const _next = (event) => {
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
                dispatch('next', { pin })
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

{#if state === ProtectState.Init || state === ProtectState.Biometric}
    <Transition>
        <Protect on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ProtectState.Pin || state === ProtectState.Confirm}
    <Transition>
        <Pin on:next={_next} on:previous={_previous} pinCandidate={pin} {locale} {mobile} />
    </Transition>
{/if}

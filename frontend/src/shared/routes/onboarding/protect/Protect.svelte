<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
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
    let pin = null

    // Reset variables based on state
    $: switch (state) {
        case ProtectState.Init:
        case ProtectState.Pin:
            pin = null
            break
    }

    const _next = (event) => {
        let params = event.detail || {}
        switch (state) {
            case ProtectState.Init:
                const { type } = params
                if (type === 'pin') {
                    state = ProtectState.Pin
                } else if (type === 'biometric') {
                    state = ProtectState.Biometric
                }
                break
            case ProtectState.Pin:
                const { pinCandidate } = params
                pin = pinCandidate
                state = ProtectState.Confirm
                break
            case ProtectState.Confirm:
                dispatch('next', { pin })
                break
        }
    }

    const _previous = () => {
        switch (state) {
            case ProtectState.Init:
                dispatch('previous')
                break
            case ProtectState.Biometric:
            case ProtectState.Pin:
                state = ProtectState.Init
                break
            case ProtectState.Confirm:
                state = ProtectState.Pin
                break
        }
    }
</script>

{#if state === ProtectState.Init || state === ProtectState.Biometric}
    <Protect on:next={_next} {locale} {mobile} />
{:else if state === ProtectState.Pin || state === ProtectState.Confirm}
    <Pin on:next={_next} pinCandidate={pin} {locale} {mobile} />
{/if}

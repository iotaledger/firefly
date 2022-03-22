<script lang="typescript">
    import { Transition } from 'shared/components'
    import { activeProfileId, clearActiveProfile, migrateProfile, profiles } from 'shared/lib/profile'
    import { mobile } from 'shared/lib/app'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { EnterPin, SelectProfile } from './views/'

    export let locale: Locale

    enum LoginState {
        Init = 'init',
        EnterPin = 'enterPin',
    }

    const dispatch = createEventDispatcher()

    let state: LoginState = LoginState.Init
    let stateHistory = []

    onMount(() => {
        if (!$mobile && get(activeProfileId) && get(profiles)?.find((p) => p.id === get(activeProfileId))) {
            _next()
        } else {
            clearActiveProfile()
        }
    })

    const _next = (
        event: {
            detail: any
        } = { detail: {} }
    ) => {
        let nextState
        const params = event?.detail || {}
        switch (state) {
            case LoginState.Init: {
                const { shouldAddProfile } = params

                if (shouldAddProfile) {
                    dispatch('next', { shouldAddProfile })
                } else {
                    nextState = LoginState.EnterPin
                }
                break
            }
            case LoginState.EnterPin:
                migrateProfile()
                dispatch('next')
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

{#if state === LoginState.Init}
    <Transition>
        <SelectProfile on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if state === LoginState.EnterPin}
    <Transition>
        <EnterPin on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{/if}

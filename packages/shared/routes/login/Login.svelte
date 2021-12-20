<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Transition } from 'shared/components'
    import { SelectProfile, EnterPin } from './views/'
    import { Locale } from 'shared/lib/typings/i18n'
    import { migrateProfile, activeProfileId } from 'shared/lib/profile'
    import { get } from 'svelte/store'

    export let locale: Locale

    export let mobile

    enum LoginState {
        Init = 'init',
        EnterPin = 'enterPin',
    }

    const dispatch = createEventDispatcher()

    let state: LoginState = get(activeProfileId) ? LoginState.EnterPin : LoginState.Init
    let stateHistory = []

    const _next = (event) => {
        let nextState
        const params = event.detail || {}
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
            state = LoginState.Init
            dispatch('previous')
        }
    }
</script>

{#if state === LoginState.Init}
    <Transition>
        <SelectProfile on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === LoginState.EnterPin}
    <Transition>
        <EnterPin on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{/if}

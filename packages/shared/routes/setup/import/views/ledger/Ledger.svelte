<script context="module" lang="typescript">
    export enum LedgerApp {
        Trinity = 'Trinity',
        Firefly = 'Firefly',
    }
</script>

<script lang="typescript">
    import { Transition } from 'shared/components'
    import { createEventDispatcher, getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { ImportType } from '../../Import.svelte'
    import { Balance, FireflyImport, Import } from './views/'

    export let locale
    export let mobile

    enum State {
        Init = 'init',
        TrinityLedgerImport = 'trinityLedgerImport',
        FireflyLedgerImport = 'fireflyLedgerImport',
        Balance = 'balance',
    }

    const dispatch = createEventDispatcher()
    const importType = getContext<Writable<ImportType>>('importType')

    let balance

    let state: State = State.Init
    let stateHistory = []

    const _next = async (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case State.Init:
                const { app } = params
                if (app === LedgerApp.Trinity) {
                    importType.set(ImportType.TrinityLedger)
                    nextState = State.TrinityLedgerImport
                } else if (app === LedgerApp.Firefly) {
                    importType.set(ImportType.FireflyLedger)
                    nextState = State.FireflyLedgerImport
                }
                break
            case State.FireflyLedgerImport:
                balance = params.balance
                nextState = State.Balance
                break
            case State.Balance:
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
        let prevState = stateHistory.pop()
        if (prevState) {
            state = prevState
        } else {
            dispatch('previous')
        }
    }
</script>

{#if state === State.Init}
    <Transition>
        <Import on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.FireflyLedgerImport}
    <Transition>
        <FireflyImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.Balance}
    <Transition>
        <Balance on:next={_next} on:previous={_previous} {balance} {locale} {mobile} />
    </Transition>
{/if}

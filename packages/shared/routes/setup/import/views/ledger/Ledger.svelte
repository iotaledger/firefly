<script context="module" lang="typescript">
    export enum LedgerApp {
        Trinity = 'Trinity',
        Firefly = 'Firefly',
    }
</script>

<script lang="typescript">
    import { Transition } from 'shared/components'
    import { createEventDispatcher, getContext } from 'svelte'
    import { get } from 'svelte/store'
    import type { Writable } from 'svelte/store'
    import { ImportType } from '../../Import.svelte'
    import {
        AccountIndex,
        Balance,
        Migrate,
        FireflyImport,
        Import,
        InstallLedgerApp,
        TrinityImport,
        GenerateNewAddress,
    } from './views/'

    export let locale
    export let mobile

    enum State {
        Init = 'init',
        FireflyImport = 'fireflyImport',
        TrinityImport = 'trinityImport',
        InstallLedgerApp = 'installLedgerApp',
        GenerateAddress = 'generateAddress',
        AccountIndex = 'accountIndex',
        Migrate = 'migrate',
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
                    nextState = State.TrinityImport
                } else if (app === LedgerApp.Firefly) {
                    importType.set(ImportType.FireflyLedger)
                    nextState = State.FireflyImport
                }
                break
            case State.FireflyImport:
                balance = params.balance
                nextState = State.Balance
                break
            case State.TrinityImport:
                nextState = State.InstallLedgerApp
                break
            case State.InstallLedgerApp:
                nextState = State.GenerateAddress
                break
            case State.GenerateAddress:
                nextState = State.AccountIndex
                break
            case State.AccountIndex:
                balance = params.balance
                nextState = State.Balance
                break
            case State.Balance:
                if (get(importType) === ImportType.FireflyLedger) {
                    dispatch('next')
                } else if (get(importType) === ImportType.TrinityLedger) {
                    nextState = State.Migrate
                }
                break
            case State.Migrate:
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
{:else if state === State.FireflyImport}
    <Transition>
        <FireflyImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.TrinityImport}
    <Transition>
        <TrinityImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.InstallLedgerApp}
    <Transition>
        <InstallLedgerApp on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.GenerateAddress}
    <Transition>
        <GenerateNewAddress on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.AccountIndex}
    <Transition>
        <AccountIndex on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.Migrate}
    <Transition>
        <Migrate on:next={_next} on:previous={_previous} {balance} {locale} {mobile} />
    </Transition>
{:else if state === State.Balance}
    <Transition>
        <Balance on:next={_next} on:previous={_previous} {balance} {locale} {mobile} />
    </Transition>
{/if}

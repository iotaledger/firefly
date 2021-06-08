<script lang="typescript">
    import { Transition } from 'shared/components'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher, onMount } from 'svelte'
    import {
        AccountIndex,
        Balance,
        Create,
        FireflyImport,
        GenerateNewAddress,
        InstallLedgerApp,
        Migrate,
        Success,
        TrinityImport,
    } from './views/'

    export let locale
    export let mobile

    enum State {
        Create = 'create',
        FireflyImport = 'fireflyImport',
        TrinityImport = 'trinityImport',
        InstallLedgerApp = 'installLedgerApp',
        GenerateAddress = 'generateAddress',
        AccountIndex = 'accountIndex',
        Migrate = 'migrate',
        Balance = 'balance',
        Success = 'success',
    }

    const dispatch = createEventDispatcher()

    let balance

    let state: State = State.Create
    let stateHistory = []

    onMount(() => {
        if ($walletSetupType === SetupType.New) {
            state = State.Create
        } else if ($walletSetupType === SetupType.TrinityLedger) {
            state = State.TrinityImport
        } else if ($walletSetupType === SetupType.FireflyLedger) {
            state = State.FireflyImport
        }
    })

    const _next = async (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case State.Create:
                dispatch('next')
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
                if ($walletSetupType === SetupType.FireflyLedger) {
                    nextState = State.Success
                } else if ($walletSetupType === SetupType.TrinityLedger) {
                    nextState = State.Migrate
                }
                break
            case State.Migrate:
                nextState = State.Success
                break
            case State.Success:
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

{#if state === State.Create}
    <Transition>
        <Create on:next={_next} on:previous={_previous} {locale} {mobile} />
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
{:else if state === State.Success}
    <Transition>
        <Success on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{/if}

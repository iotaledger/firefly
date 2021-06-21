<script lang="typescript">
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress, LedgerMigrationProgress } from 'shared/lib/migration'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher, onMount } from 'svelte'
    import { AccountIndex, Balance, Create, FireflyImport, GenerateNewAddress, InstallLedgerApp, TrinityImport } from './views/'

    export let locale
    export let mobile

    enum State {
        Create = 'create',
        FireflyImport = 'fireflyImport',
        TrinityImport = 'trinityImport',
        InstallLedgerApp = 'installLedgerApp',
        GenerateAddress = 'generateAddress',
        AccountIndex = 'accountIndex',
        Balance = 'balance',
    }

    const dispatch = createEventDispatcher()

    let balance

    let state: State
    let stateHistory = []

    onMount(() => {
        if ($walletSetupType === SetupType.New) {
            state = State.Create
        } else if ($walletSetupType === SetupType.TrinityLedger) {
            state = State.TrinityImport
        } else if ($walletSetupType === SetupType.FireflyLedger) {
            state = State.FireflyImport
        }
        currentLedgerMigrationProgress.set(null)
    })

    $: state, updateMigrationProgress()

    const updateMigrationProgress = () => {
        switch (state) {
            case State.InstallLedgerApp:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case State.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case State.AccountIndex:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case State.Balance:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.TransferFunds)
                break
            default:
                currentLedgerMigrationProgress.set(null)
                break
        }
    }

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
{:else if state === State.Balance}
    <!-- TODO: we could use the standalone balance view -->
    <Transition>
        <Balance on:next={_next} on:previous={_previous} {balance} {locale} {mobile} />
    </Transition>
{/if}

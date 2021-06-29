<script lang="typescript">
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress, LedgerMigrationProgress } from 'shared/lib/migration'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher, onMount } from 'svelte'
    import {
        AccountIndex,
        Balance,
        Connect,
        GenerateNewAddress,
        InstallationGuide,
        LegacyIntro,
        RestoreFromLedger,
        SwitchApps,
    } from './views/'

    export let locale
    export let mobile

    enum State {
        Connect = 'connect',
        RestoreFromLedger = 'restoreFromLedger',
        LegacyIntro = 'legacyIntro',
        InstallationGuide = 'installationGuide',
        GenerateAddress = 'generateAddress',
        SwitchApps = 'switchApps',
        AccountIndex = 'accountIndex',
        Balance = 'balance',
    }

    const dispatch = createEventDispatcher()

    let balance

    let state: State
    let stateHistory = []

    onMount(() => {
        if ($walletSetupType === SetupType.New || $walletSetupType === SetupType.FireflyLedger) {
            state = State.Connect
        } else if ($walletSetupType === SetupType.TrinityLedger) {
            state = State.LegacyIntro
        }
        currentLedgerMigrationProgress.set(null)
    })

    $: state, updateMigrationProgress()

    const updateMigrationProgress = () => {
        switch (state) {
            case State.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case State.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case State.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case State.AccountIndex:
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
            case State.Connect:
                if ($walletSetupType === SetupType.New) {
                    dispatch('next')
                } else if ($walletSetupType === SetupType.FireflyLedger) {
                    nextState = State.RestoreFromLedger
                } else if ($walletSetupType === SetupType.TrinityLedger) {
                    nextState = State.GenerateAddress
                }
                break
            case State.RestoreFromLedger:
                dispatch('next')
                break
            case State.LegacyIntro:
                nextState = State.InstallationGuide
                break
            case State.InstallationGuide:
                nextState = State.Connect
                break
            case State.GenerateAddress:
                nextState = State.SwitchApps
                break
            case State.SwitchApps:
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

{#if state === State.Connect}
    <Transition>
        <Connect on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.RestoreFromLedger}
    <Transition>
        <RestoreFromLedger on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.LegacyIntro}
    <Transition>
        <LegacyIntro on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.InstallationGuide}
    <Transition>
        <InstallationGuide on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.GenerateAddress}
    <Transition>
        <GenerateNewAddress on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === State.SwitchApps}
    <Transition>
        <SwitchApps on:next={_next} on:previous={_previous} {locale} {mobile} />
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

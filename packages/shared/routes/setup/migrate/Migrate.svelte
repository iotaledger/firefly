<script lang="typescript">
    import { Transition } from 'shared/components'
    import { hasBundlesWithSpentAddresses, hasSingleBundle } from 'shared/lib/migration'
    import { createEventDispatcher } from 'svelte'
    import {
        BundleMiningWarning,
        Migrate,
        SecureSpentAddresses,
        SecuringSpentAddresses,
        SecurityCheckCompleted,
        TransferFragmentedFunds,
    } from './views/'

    export let locale
    export let mobile

    enum MigrateState {
        Init = 'init',
        TransferFragmentedFunds = 'transferFragmentedFunds',
        BundleMiningWarning = 'bundleMiningWarning',
        SecureSpentAddresses = 'secureSpentAddresses',
        SecuringSpentAddresses = 'securingSpentAddresses',
        SecurityCheckCompleted = 'securityCheckCompleted',
    }

    const dispatch = createEventDispatcher()

    let state: MigrateState = MigrateState.Init
    let stateHistory = []

    const _next = async (event) => {
        let nextState
        const params = event.detail || {}

        switch (state) {
            case MigrateState.Init:
                if ($hasBundlesWithSpentAddresses) {
                    nextState = MigrateState.BundleMiningWarning
                    break
                }

                if ($hasSingleBundle) {
                    dispatch('next')
                } else {
                    nextState = MigrateState.TransferFragmentedFunds
                }

                break

            case MigrateState.TransferFragmentedFunds:
                dispatch('next')
                break
            case MigrateState.BundleMiningWarning:
                nextState = MigrateState.SecureSpentAddresses
                break
            case MigrateState.SecureSpentAddresses: {
                const { skippedMining } = params
                nextState = skippedMining ? MigrateState.TransferFragmentedFunds : MigrateState.SecuringSpentAddresses
                break
            }
            case MigrateState.SecuringSpentAddresses:
                nextState = MigrateState.SecurityCheckCompleted
                break
            case MigrateState.SecurityCheckCompleted:
                nextState = MigrateState.TransferFragmentedFunds
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

{#if state === MigrateState.Init}
    <Transition>
        <Migrate on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === MigrateState.TransferFragmentedFunds}
    <Transition>
        <TransferFragmentedFunds on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === MigrateState.BundleMiningWarning}
    <Transition>
        <BundleMiningWarning on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === MigrateState.SecureSpentAddresses}
    <Transition>
        <SecureSpentAddresses on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === MigrateState.SecuringSpentAddresses}
    <Transition>
        <SecuringSpentAddresses on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === MigrateState.SecurityCheckCompleted}
    <Transition>
        <SecurityCheckCompleted on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{/if}

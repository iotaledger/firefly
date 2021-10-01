<script lang="typescript">
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress, LedgerMigrationProgress } from 'shared/lib/migration'
    import { ledgerRoute, ledgerRouteHistory, walletSetupType } from 'shared/lib/router'
    import { LedgerRoutes, SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import {
        AccountIndex,
        Connect,
        GenerateNewAddress,
        InstallationGuide,
        LegacyIntro,
        RestoreFromLedger,
        SwitchApps,
    } from './views/'

    export let locale

    const dispatch = createEventDispatcher()

    $: $ledgerRoute, updateMigrationProgress()

    onMount(() => {
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (!$ledgerRouteHistory.length) {
            if ($walletSetupType === SetupType.New || $walletSetupType === SetupType.FireflyLedger) {
                ledgerRoute.set(LedgerRoutes.Connect)
            } else {
                ledgerRoute.set(LedgerRoutes.LegacyIntro)
            }
        }
    })

    const updateMigrationProgress = () => {
        switch (get(ledgerRoute)) {
            case LedgerRoutes.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case LedgerRoutes.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case LedgerRoutes.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case LedgerRoutes.AccountIndex:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.TransferFunds)
                break
            default:
                currentLedgerMigrationProgress.set(null)
                break
        }
    }

    const _next = async (event) => {
        let nextState
        switch (get(ledgerRoute)) {
            case LedgerRoutes.Connect:
                if ($walletSetupType === SetupType.New) {
                    dispatch('next')
                } else if ($walletSetupType === SetupType.FireflyLedger) {
                    nextState = LedgerRoutes.RestoreFromLedger
                } else if ($walletSetupType === SetupType.TrinityLedger) {
                    nextState = LedgerRoutes.GenerateAddress
                }
                break
            case LedgerRoutes.RestoreFromLedger:
                dispatch('next')
                break
            case LedgerRoutes.LegacyIntro:
                nextState = LedgerRoutes.InstallationGuide
                break
            case LedgerRoutes.InstallationGuide:
                nextState = LedgerRoutes.Connect
                break
            case LedgerRoutes.GenerateAddress:
                nextState = LedgerRoutes.SwitchApps
                break
            case LedgerRoutes.SwitchApps:
                nextState = LedgerRoutes.AccountIndex
                break
            case LedgerRoutes.AccountIndex:
                dispatch('next')
                break
        }
        if (nextState) {
            $ledgerRouteHistory.push(get(ledgerRoute))
            ledgerRoute.set(nextState)
        }
    }
    const _previous = () => {
        let prevState = $ledgerRouteHistory.pop() as LedgerRoutes
        if (prevState) {
            ledgerRoute.set(prevState)
        } else {
            dispatch('previous')
        }
    }
</script>

{#if $ledgerRoute === LedgerRoutes.Connect}
    <Transition>
        <Connect on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.RestoreFromLedger}
    <Transition>
        <RestoreFromLedger on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.LegacyIntro}
    <Transition>
        <LegacyIntro on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.InstallationGuide}
    <Transition>
        <InstallationGuide on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.GenerateAddress}
    <Transition>
        <GenerateNewAddress on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.SwitchApps}
    <Transition>
        <SwitchApps on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.AccountIndex}
    <Transition>
        <AccountIndex on:next={_next} on:previous={_previous} {locale} />
    </Transition>
{/if}

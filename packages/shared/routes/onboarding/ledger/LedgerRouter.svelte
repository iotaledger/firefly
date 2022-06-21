<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress } from 'shared/lib/migration'
    import { FireflyEvent, ledgerRoute, ledgerRouter, LedgerRoute } from '@core/router'
    import {
        AccountIndexView,
        ConnectView,
        GenerateNewAddressView,
        InstallationGuideView,
        LegacyIntroView,
        RestoreFromLedgerView,
        SwitchAppsView,
    } from './views/'
    import { LedgerMigrationProgress } from 'shared/lib/typings/migration'

    $: $ledgerRoute, updateMigrationProgress()

    onMount(() => {
        $ledgerRouter.restartIfNotInLedgerFlow()
    })

    const updateMigrationProgress = (): void => {
        switch ($ledgerRoute) {
            case LedgerRoute.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case LedgerRoute.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case LedgerRoute.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case LedgerRoute.AccountIndex:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.TransferFunds)
                break
            default:
                currentLedgerMigrationProgress.set(null)
                break
        }
    }

    const next = (event: CustomEvent<FireflyEvent>): void => $ledgerRouter.next(event.detail)
    const previous = (): void => $ledgerRouter.previous()
</script>

{#if $ledgerRoute === LedgerRoute.Connect}
    <Transition>
        <ConnectView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.RestoreFromLedger}
    <Transition>
        <RestoreFromLedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.LegacyIntro}
    <Transition>
        <LegacyIntroView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.InstallationGuide}
    <Transition>
        <InstallationGuideView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.GenerateAddress}
    <Transition>
        <GenerateNewAddressView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.SwitchApps}
    <Transition>
        <SwitchAppsView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.AccountIndex}
    <Transition>
        <AccountIndexView on:next={next} on:previous={previous} />
    </Transition>
{/if}

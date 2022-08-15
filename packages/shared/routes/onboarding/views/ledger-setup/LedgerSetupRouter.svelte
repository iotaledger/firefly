<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress } from '@lib/migration'
    import { FireflyEvent, ledgerSetupRoute, ledgerSetupRouter, LedgerSetupRoute } from '@core/router'
    import {
        AccountIndexView,
        ConnectView,
        GenerateNewAddressView,
        InstallationGuideView,
        LegacyIntroView,
        RestoreFromLedgerView,
        SwitchAppsView,
    } from './views'
    import { LedgerMigrationProgress } from '@lib/typings/migration'

    $: $ledgerSetupRoute, updateMigrationProgress()

    onMount(() => {
        $ledgerSetupRouter.restartIfNotInLedgerFlow()
    })

    const updateMigrationProgress = (): void => {
        switch ($ledgerSetupRoute) {
            case LedgerSetupRoute.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case LedgerSetupRoute.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case LedgerSetupRoute.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case LedgerSetupRoute.AccountIndex:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.TransferFunds)
                break
            default:
                currentLedgerMigrationProgress.set(null)
                break
        }
    }

    function next(event: CustomEvent<FireflyEvent>): void {
        $ledgerSetupRouter.next(event.detail)
    }

    function previous(): void {
        $ledgerSetupRouter.previous()
    }
</script>

{#if $ledgerSetupRoute === LedgerSetupRoute.Connect}
    <Transition>
        <ConnectView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.RestoreFromLedger}
    <Transition>
        <RestoreFromLedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.LegacyIntro}
    <Transition>
        <LegacyIntroView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.InstallationGuide}
    <Transition>
        <InstallationGuideView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.GenerateAddress}
    <Transition>
        <GenerateNewAddressView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.SwitchApps}
    <Transition>
        <SwitchAppsView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.AccountIndex}
    <Transition>
        <AccountIndexView on:next={next} on:previous={previous} />
    </Transition>
{/if}

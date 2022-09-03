<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
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

    onMount(() => {
        $ledgerSetupRouter.restartIfNotInLedgerFlow()
    })

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

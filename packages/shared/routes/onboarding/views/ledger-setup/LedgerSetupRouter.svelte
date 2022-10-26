<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { IRouterEvent, ledgerSetupRoute, ledgerSetupRouter, LedgerSetupRoute } from '@core/router'
    import { ConnectLedgerView, LedgerInstallationGuideView } from './views'

    onMount(() => {
        $ledgerSetupRouter.restartIfNotInLedgerFlow()
    })

    function next(event: CustomEvent<IRouterEvent>): void {
        $ledgerSetupRouter.next(event.detail)
    }

    function previous(): void {
        $ledgerSetupRouter.previous()
    }
</script>

{#if $ledgerSetupRoute === LedgerSetupRoute.ConnectLedger}
    <Transition>
        <ConnectLedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.LedgerInstallationGuide}
    <Transition>
        <LedgerInstallationGuideView on:next={next} on:previous={previous} />
    </Transition>
{/if}

<script lang="ts">
    import { Platform } from '@core/app'
    import { LedgerSetupRoute, ledgerSetupRoute, ledgerSetupRouter } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { onMount } from 'svelte'
    import { ConnectLedgerView, LedgerInstallationGuideView } from './views'

    $: if (features.analytics.onboardingRoute.ledgerSetupRoute.enabled && $ledgerSetupRoute) {
        Platform.trackEvent('ledger-setup-route', { route: $ledgerSetupRoute })
    }

    onMount(() => {
        $ledgerSetupRouter.restartIfNotInLedgerFlow()
    })
</script>

{#if $ledgerSetupRoute === LedgerSetupRoute.ConnectLedger}
    <Transition>
        <ConnectLedgerView />
    </Transition>
{:else if $ledgerSetupRoute === LedgerSetupRoute.LedgerInstallationGuide}
    <Transition>
        <LedgerInstallationGuideView />
    </Transition>
{/if}

<script lang="ts">
    import { Transition } from '@ui'
    import { CreateFromLedgerRoute } from './create-from-ledger-route.enum'
    import { createFromLedgerRoute } from './create-from-ledger-router'
    import { ConnectLedgerView, InstallLedgerView } from './views'
    import { Subrouter } from '@core/router'

    export let router: Subrouter<unknown>

    $: if (features.analytics.onboardingRoute.enabled && $createFromLedgerRoute) {
        Platform.trackEvent('create-from-ledger-route', { route: $createFromLedgerRoute })
    }
</script>

{#if $createFromLedgerRoute === CreateFromLedgerRoute.InstallLedger}
    <Transition>
        <InstallLedgerView />
    </Transition>
{:else if $createFromLedgerRoute === CreateFromLedgerRoute.ConnectLedger}
    <Transition>
        <ConnectLedgerView {router} />
    </Transition>
{/if}

<script lang="ts">
    import { Platform } from '@core/app'
    import { Subrouter } from '@core/router'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { CreateFromLedgerRoute, createFromLedgerRoute } from '@core/router'
    import { ConnectLedgerView, InstallLedgerView } from './views'

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

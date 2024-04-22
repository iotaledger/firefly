<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { CreateFromLedgerRouterView } from '../create-from-ledger'
    import { RestoreFromMnemonicRouterView } from '../restore-from-mnemonic'
    import { RestoreFromStrongholdRouterView } from '../restore-from-stronghold'
    import { restoreProfileRoute, restoreProfileRouter, RestoreProfileRoute } from '@core/router'
    import { ChooseRestoreProfileFlowView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreProfileRoute) {
        Platform.trackEvent('restore-profile-route', { route: $restoreProfileRoute })
    }
</script>

{#if $restoreProfileRoute === RestoreProfileRoute.ChooseRestoreProfileFlow}
    <Transition>
        <ChooseRestoreProfileFlowView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromMnemonic}
    <Transition>
        <RestoreFromMnemonicRouterView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromStronghold}
    <Transition>
        <RestoreFromStrongholdRouterView />
    </Transition>
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromLedger}
    <Transition>
        <CreateFromLedgerRouterView router={$restoreProfileRouter} />
    </Transition>
    <!-- {:else if $restoreProfileRoute === RestoreProfileRoute.ClaimFinder}
    <Transition>
        <ClaimFinderView />
    </Transition> -->
{/if}

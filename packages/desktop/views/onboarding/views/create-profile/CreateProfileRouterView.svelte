<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { CreateFromLedgerRouterView } from '../create-from-ledger'
    import { CreateFromMnemonicRouterView } from '../create-from-mnemonic'
    import { createProfileRoute, createProfileRouter, CreateProfileRoute } from '@core/router'
    import { ChooseCreateProfileFlowView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $createProfileRoute) {
        Platform.trackEvent('create-profile-route', { route: $createProfileRoute })
    }
</script>

{#if $createProfileRoute === CreateProfileRoute.ChooseCreateProfileFlow}
    <Transition>
        <ChooseCreateProfileFlowView />
    </Transition>
{:else if $createProfileRoute === CreateProfileRoute.CreateFromMnemonic}
    <Transition>
        <CreateFromMnemonicRouterView />
    </Transition>
{:else if $createProfileRoute === CreateProfileRoute.CreateFromLedger}
    <Transition>
        <CreateFromLedgerRouterView router={$createProfileRouter} />
    </Transition>
{/if}

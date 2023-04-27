<script lang="ts">
    import { Platform } from '@core/app'
    import { NetworkSetupRoute, networkSetupRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { ChooseNetworkView, SetupCustomNetworkConnectionView } from './views'

    $: if (features.analytics.onboardingRoute.networkSetupRoute.enabled && $networkSetupRoute) {
        Platform.trackEvent('network-setup-route', { route: $networkSetupRoute })
    }
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <Transition>
        <ChooseNetworkView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.SetupCustomNetworkConnection}
    <Transition>
        <SetupCustomNetworkConnectionView />
    </Transition>
{/if}

<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { NetworkSetupRoute } from './network-setup-route.enum'
    import { networkSetupRoute } from './network-setup-router'
    import { ChooseNetworkView, CustomNetworkView } from './views'

    $: if (features.analytics.onboardingRoute.networkSetupRoute.enabled && $networkSetupRoute) {
        Platform.trackEvent('network-setup-route', { route: $networkSetupRoute })
    }
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <Transition>
        <ChooseNetworkView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.CustomNetworkView}
    <Transition>
        <CustomNetworkView />
    </Transition>
{/if}

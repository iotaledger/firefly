<script lang="typescript">
    import { Transition } from 'shared/components'
    import { OnboardingCustomNetworkView, OnboardingNetworkView, OnboardingProtocolView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '@core/router'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.Protocol}
    <Transition>
        <OnboardingProtocolView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.Network}
    <Transition>
        <OnboardingNetworkView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.CustomNetwork}
    <Transition>
        <OnboardingCustomNetworkView />
    </Transition>
{/if}

<script lang="typescript">
    import { Transition } from 'shared/components'
    import { OnboardingCustomNetworkView, OnboardingNetworkView, OnboardingProtocolView } from './views'
    import { NetworkRoute, networkRoute } from '@core/router'
</script>

{#if $networkRoute === NetworkRoute.Protocol}
    <Transition>
        <OnboardingProtocolView />
    </Transition>
{:else if $networkRoute === NetworkRoute.Network}
    <Transition>
        <OnboardingNetworkView />
    </Transition>
{:else if $networkRoute === NetworkRoute.CustomNetwork}
    <Transition>
        <OnboardingCustomNetworkView />
    </Transition>
{/if}

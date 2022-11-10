<script lang="typescript">
    import { Transition } from 'shared/components'
    import { ChooseNetworkView, ChooseProtocolView, SetupPrivateNetworkConnectionView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '@core/router'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseProtocol}
    <Transition>
        <ChooseProtocolView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <Transition>
        <ChooseNetworkView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.SetupPrivateNetworkConnection}
    <Transition>
        <SetupPrivateNetworkConnectionView />
    </Transition>
{/if}

<script lang="ts">
    import { NetworkSetupRoute, networkSetupRoute } from '@core/router'
    import { Transition } from 'shared/components'
    import { ChooseNetworkView, SetupPrivateNetworkConnectionView } from './views'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <Transition>
        <ChooseNetworkView />
    </Transition>
{:else if $networkSetupRoute === NetworkSetupRoute.SetupPrivateNetworkConnection}
    <Transition>
        <SetupPrivateNetworkConnectionView />
    </Transition>
{/if}

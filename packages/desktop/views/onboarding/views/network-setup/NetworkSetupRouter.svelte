<script lang="ts">
    import { Transition } from 'shared/components'
    import { ChooseNetworkView, SetupCustomNetworkConnectionView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '@core/router'
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

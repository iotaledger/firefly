<script lang="typescript">
    import { Transition } from 'shared/components'
    import { ChooseNetworkView, ChooseProtocolView } from './views'
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
{/if}

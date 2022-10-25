<script lang="typescript">
    import { ChooseNetworkView, ChooseProtocolView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '../../../../lib/routers'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseProtocol}
    <ChooseProtocolView />
{:else if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <ChooseNetworkView />
{/if}

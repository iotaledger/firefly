<script lang="ts">
    import { ChooseNetworkView, ChooseProtocolView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '@/routers'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseProtocol}
    <ChooseProtocolView />
{:else if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <ChooseNetworkView />
{/if}

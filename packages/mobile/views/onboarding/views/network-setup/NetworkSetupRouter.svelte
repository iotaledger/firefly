<script lang="ts">
    import { ChooseNetworkView } from './views'
    import { NetworkSetupRoute, networkSetupRoute } from '@/routers'
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <ChooseNetworkView />
{/if}

<script lang="ts">
    import { SetupStrongholdPasswordView } from './views'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '@/routers'
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <SetupStrongholdPasswordView />
{/if}

<script lang="typescript">
    import { SetupStrongholdPasswordView } from './views'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '../../../../lib/routers'
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <SetupStrongholdPasswordView />
{/if}

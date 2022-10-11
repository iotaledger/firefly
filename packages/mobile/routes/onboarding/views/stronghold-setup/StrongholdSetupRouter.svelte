<script lang="typescript">
    import { SetupStrongholdPasswordView } from './views'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '@core/router'
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <SetupStrongholdPasswordView />
{/if}

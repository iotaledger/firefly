<script lang="typescript">
    import { SetupStrongholdPasswordView } from './views'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '../../../../lib/core/router'
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <SetupStrongholdPasswordView />
{/if}

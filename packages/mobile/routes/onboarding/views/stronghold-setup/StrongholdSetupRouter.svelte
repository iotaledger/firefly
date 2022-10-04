<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupStrongholdPasswordView } from './views'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '@core/router'
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <Transition>
        <SetupStrongholdPasswordView />
    </Transition>
{/if}

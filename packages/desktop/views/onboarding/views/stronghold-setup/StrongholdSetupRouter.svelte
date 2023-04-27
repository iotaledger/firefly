<script lang="ts">
    import { Platform } from '@core/app'
    import { strongholdSetupRoute, StrongholdSetupRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { SetupStrongholdPasswordView } from './views'

    $: if (features.analytics.onboardingRoute.strongholdSetupRoute.enabled && $strongholdSetupRoute) {
        Platform.trackEvent('stronghold-setup-route', { route: $strongholdSetupRoute })
    }
</script>

{#if $strongholdSetupRoute === StrongholdSetupRoute.SetupStrongholdPassword}
    <Transition>
        <SetupStrongholdPasswordView />
    </Transition>
{/if}

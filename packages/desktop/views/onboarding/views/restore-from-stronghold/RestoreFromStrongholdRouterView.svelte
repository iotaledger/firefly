<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { UpdateStrongholdRouterView } from '@views/update-stronghold'
    import { Transition } from 'shared/components'
    import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'
    import { restoreFromStrongholdRoute } from './restore-from-stronghold-router'
    import { ImportStrongholdView, UnlockStrongholdView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreFromStrongholdRoute) {
        Platform.trackEvent('restore-from-stronghold-route', { route: $restoreFromStrongholdRoute })
    }
</script>

{#if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.ImportStronghold}
    <Transition>
        <ImportStrongholdView />
    </Transition>
{:else if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.UnlockStronghold}
    <Transition>
        <UnlockStrongholdView />
    </Transition>
{:else if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdRouterView isRecovery />
    </Transition>
{/if}

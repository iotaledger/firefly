<script lang="ts">
    import { Platform } from '@core/app'
    import { LoginRoute, loginRoute, loginRouter } from '@core/router'
    import features from '@features/features'
    import { UpdateStrongholdRouterView } from '@views'
    import { Transition } from 'shared/components'
    import { BalanceOverviewView } from '../shared'
    import { EnterPinView, LoadProfileView, SelectProfileView } from './views'

    $: if (features.analytics.loginRoute.enabled && $loginRoute)
        Platform.trackEvent('login-route', { route: $loginRoute })
</script>

{#if $loginRoute === LoginRoute.SelectProfile}
    <Transition>
        <SelectProfileView />
    </Transition>
{:else if $loginRoute === LoginRoute.EnterPin}
    <Transition>
        <EnterPinView />
    </Transition>
{:else if $loginRoute === LoginRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdRouterView />
    </Transition>
{:else if $loginRoute === LoginRoute.BalanceOverview}
    <Transition>
        <BalanceOverviewView allowBack={false} onContinueClick={() => $loginRouter.next()} />
    </Transition>
{:else if $loginRoute === LoginRoute.LoadProfile}
    <Transition>
        <LoadProfileView />
    </Transition>
{/if}

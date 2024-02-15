<script lang="ts">
    import { Platform } from '@core/app'
    import { LoginRoute, loginRoute } from '@core/router'
    import features from '@features/features'
    import { UpdateStrongholdRouterView } from '@views'
    import { Transition } from '@ui'
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
{:else if $loginRoute === LoginRoute.LoadProfile}
    <Transition>
        <LoadProfileView />
    </Transition>
{/if}

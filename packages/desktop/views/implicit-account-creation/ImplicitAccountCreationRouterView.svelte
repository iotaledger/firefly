<script lang="ts">
    import { Platform } from '@core/app'
    import { ImplicitAccountCreationRoute, implicitAccountCreationRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { MainView } from './views'

    $: if (features.analytics.implicitAccountCreationRoute.enabled && $implicitAccountCreationRoute)
        Platform.trackEvent('implicit-account-route', { route: $implicitAccountCreationRoute })
</script>

{#if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.Activate}
    <Transition>
        <MainView />
    </Transition>
{/if}

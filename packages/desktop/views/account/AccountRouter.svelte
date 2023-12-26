<script lang="ts">
    import { Platform } from '@core/app'
    import { AccountRoute, accountRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { MainView } from './activate'

    $: if (features.analytics.accountRoute.enabled && $accountRoute)
        Platform.trackEvent('account-route', { route: $accountRoute })
</script>

{#if $accountRoute === AccountRoute.Activate}
    <Transition>
        <MainView />
    </Transition>
{/if}

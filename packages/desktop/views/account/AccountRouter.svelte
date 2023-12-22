<script lang="ts">
    import { Platform } from '@core/app'
    import { AccountRoute, accountRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'

    $: if (features.analytics.accountRoute.enabled && $accountRoute)
        Platform.trackEvent('account-route', { route: $accountRoute })
</script>

{#if $accountRoute === AccountRoute.Activate}
    <Transition>
        <div class="flex w-full h-full p-12">
            <h1 class="text-white">ACCOUNT ROUTE</h1>
        </div>
    </Transition>
{/if}

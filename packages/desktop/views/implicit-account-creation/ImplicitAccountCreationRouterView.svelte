<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Platform } from '@core/app'
    import { ImplicitAccountCreationRoute, implicitAccountCreationRoute } from '@core/router'
    import { subscribeToWalletApiEventsForImplicitAccountCreation } from '@contexts/implicit-account-creation'
    import { unsubscribeFromWalletApiEvents } from '@core/wallet'
    import features from '@features/features'
    import { Transition } from 'shared/components'

    $: if (features.analytics.implicitAccountCreationRoute.enabled && $implicitAccountCreationRoute)
        Platform.trackEvent('account-route', { route: $implicitAccountCreationRoute })

    onMount(() => {
        subscribeToWalletApiEventsForImplicitAccountCreation()
    })
    onDestroy(() => {
        unsubscribeFromWalletApiEvents()
    })
</script>

{#if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.Activate}
    <Transition>
        <div class="flex w-full h-full p-12">
            <h1 class="text-white">ACCOUNT ROUTE</h1>
        </div>
    </Transition>
{/if}

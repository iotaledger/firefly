<script lang="ts">
    import { Platform } from '@core/app'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'

    const busy = false

    $: if (features.analytics.onboardingRoute.storageProtectionSetupRoute.enabled && $storageProtectionSetupRoute) {
        Platform.trackEvent('storage-protection-setup-route', { route: $storageProtectionSetupRoute })
    }
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} />
    </Transition>
{/if}

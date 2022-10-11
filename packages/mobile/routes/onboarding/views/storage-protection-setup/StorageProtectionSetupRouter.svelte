<script lang="typescript">
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '@core/router'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <SetupPinProtectionView {busy} />
{/if}

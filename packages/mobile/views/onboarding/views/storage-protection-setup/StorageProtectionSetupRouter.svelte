<script lang="ts">
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '@/routers'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <SetupPinProtectionView {busy} />
{/if}

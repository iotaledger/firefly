<script lang="typescript">
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '../../../../lib/routers'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <SetupPinProtectionView {busy} />
{/if}

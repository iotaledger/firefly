<script lang="typescript">
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '../../../../lib/core/router'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <SetupPinProtectionView {busy} />
{/if}

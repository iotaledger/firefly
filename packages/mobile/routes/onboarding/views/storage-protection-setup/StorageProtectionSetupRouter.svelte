<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, StorageProtectionSetupRoute } from '@core/router'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === StorageProtectionSetupRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} />
    </Transition>
{/if}

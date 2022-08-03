<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { storageProtectionSetupRoute, ProtectionRoute } from '@core/router'

    const busy = false
</script>

{#if $storageProtectionSetupRoute === ProtectionRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} />
    </Transition>
{/if}

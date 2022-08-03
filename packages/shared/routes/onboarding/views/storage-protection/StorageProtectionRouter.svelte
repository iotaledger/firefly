<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { storageProtectionRoute, ProtectionRoute } from '@core/router'

    const busy = false
</script>

{#if $storageProtectionRoute === ProtectionRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} />
    </Transition>
{/if}

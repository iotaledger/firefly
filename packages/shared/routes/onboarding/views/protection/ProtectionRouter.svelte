<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { protectionRoute, ProtectionRoute } from '@core/router'

    const busy = false
</script>

{#if $protectionRoute === ProtectionRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} />
    </Transition>
{/if}

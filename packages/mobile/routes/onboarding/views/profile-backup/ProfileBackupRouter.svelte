<script lang="typescript">
    import { Transition } from 'shared/components'
    import { VerifyMnemonicView, ViewMnemonicView } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '@core/router'
</script>

{#if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <Transition>
        <ViewMnemonicView />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <Transition>
        <VerifyMnemonicView />
    </Transition>
{/if}

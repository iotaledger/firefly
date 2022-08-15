<script lang="typescript">
    import { Transition } from 'shared/components'
    import { BackupMnemonic, BackupStronghold, VerifyMnemonic, ViewMnemonic } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '@core/router'
</script>

{#if $profileBackupRoute === ProfileBackupRoute.BackupMnemonic}
    <Transition>
        <BackupMnemonic />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <Transition>
        <ViewMnemonic />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <Transition>
        <VerifyMnemonic />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.BackupStronghold}
    <Transition>
        <BackupStronghold />
    </Transition>
{/if}

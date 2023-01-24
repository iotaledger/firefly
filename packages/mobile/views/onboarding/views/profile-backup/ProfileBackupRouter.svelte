<script lang="typescript">
    import { BackupStrongholdView, VerifyMnemonicView, ViewMnemonicView } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '../../../../lib/routers'
</script>

{#if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <ViewMnemonicView />
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <VerifyMnemonicView />
{:else if $profileBackupRoute === ProfileBackupRoute.BackupStronghold}
    <BackupStrongholdView />
{/if}

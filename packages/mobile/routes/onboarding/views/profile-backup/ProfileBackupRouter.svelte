<script lang="typescript">
    import { VerifyMnemonicView, ViewMnemonicView } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '@core/router'
</script>

{#if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <ViewMnemonicView />
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <VerifyMnemonicView />
{/if}

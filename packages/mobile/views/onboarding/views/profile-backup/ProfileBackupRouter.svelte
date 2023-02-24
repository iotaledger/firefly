<script lang="ts">
    import { VerifyMnemonicView, ViewMnemonicView } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '@/routers'
</script>

{#if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <ViewMnemonicView />
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <VerifyMnemonicView />
{/if}

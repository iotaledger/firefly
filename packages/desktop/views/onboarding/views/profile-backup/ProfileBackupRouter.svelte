<script lang="ts">
    import { Transition } from 'shared/components'
    import { BackupMnemonicView, BackupStrongholdView, VerifyMnemonicView, ViewMnemonicView } from './views'
    import { profileBackupRoute, ProfileBackupRoute } from '@core/router'
    import features from '@features/features'
    import { Platform } from '@core/app'

    $: if (features.analytics.onboardingRoute.profileBackupRoute.enabled && $profileBackupRoute) {
        Platform.trackEvent('profile-backup-route', { route: $profileBackupRoute })
    }
</script>

{#if $profileBackupRoute === ProfileBackupRoute.BackupMnemonic}
    <Transition>
        <BackupMnemonicView />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.ViewMnemonic}
    <Transition>
        <ViewMnemonicView />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.VerifyMnemonic}
    <Transition>
        <VerifyMnemonicView />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.BackupStronghold}
    <Transition>
        <BackupStrongholdView />
    </Transition>
{/if}

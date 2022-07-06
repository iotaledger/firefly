<script lang="typescript">
    import { Transition } from 'shared/components'
    import { BackupView, BackupToFileView, RecoveryPhraseView, VerifyRecoveryPhraseView } from './views'
    import { localize } from '@core/i18n'
    import { profileBackupRoute, profileBackupRouter, ProfileBackupRoute, FireflyEvent } from '@core/router'
    import { mnemonic, strongholdPassword } from '@contexts/onboarding'
    import { showAppNotification } from '@lib/notifications'

    let busy = false

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await $profileBackupRouter.next(event.detail)
        } catch (err) {
            console.error(err)
            showAppNotification({
                type: 'error',
                message: localize(err.error ?? 'error.global.generic'),
            })
        } finally {
            busy = false
        }
    }

    function previous(): void {
        $profileBackupRouter.previous()
    }
</script>

{#if $profileBackupRoute === ProfileBackupRoute.Init}
    <Transition>
        <BackupView on:next={next} on:previous={previous} {busy} />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.RecoveryPhrase}
    <Transition>
        <RecoveryPhraseView on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.Verify}
    <Transition>
        <VerifyRecoveryPhraseView on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} />
    </Transition>
{:else if $profileBackupRoute === ProfileBackupRoute.Backup}
    <Transition>
        <BackupToFileView on:next={next} on:previous={previous} {busy} strongholdPassword={$strongholdPassword} />
    </Transition>
{/if}

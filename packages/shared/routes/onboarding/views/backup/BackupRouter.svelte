<script lang="typescript">
    import { Transition } from 'shared/components'
    import { BackupView, BackupToFileView, RecoveryPhraseView, VerifyRecoveryPhraseView } from './views'
    import { localize } from '@core/i18n'
    import { backupRoute, backupRouter, BackupRoute, FireflyEvent } from '@core/router'
    import { mnemonic, strongholdPassword } from '@contexts/onboarding'
    import { showAppNotification } from '@lib/notifications'

    let busy = false

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await $backupRouter.next(event.detail)
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
        $backupRouter.previous()
    }
</script>

{#if $backupRoute === BackupRoute.Init}
    <Transition>
        <BackupView on:next={next} on:previous={previous} {busy} />
    </Transition>
{:else if $backupRoute === BackupRoute.RecoveryPhrase}
    <Transition>
        <RecoveryPhraseView on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} />
    </Transition>
{:else if $backupRoute === BackupRoute.Verify}
    <Transition>
        <VerifyRecoveryPhraseView on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} />
    </Transition>
{:else if $backupRoute === BackupRoute.Backup}
    <Transition>
        <BackupToFileView on:next={next} on:previous={previous} {busy} strongholdPassword={$strongholdPassword} />
    </Transition>
{/if}

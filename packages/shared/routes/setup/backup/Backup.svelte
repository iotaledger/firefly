<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic, strongholdPassword } from 'shared/lib/app'
    import { Backup, BackupToFile, RecoveryPhrase, VerifyRecoveryPhrase } from './views/'
    import { backupRoute, BackupRouter, BackupRoutes } from '@core/router'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Locale } from 'shared/lib/typings/i18n'
    import { FireflyEvent } from '@core/router/types/event'

    export let locale: Locale

    const backupRouter = new BackupRouter()

    let busy = false

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await backupRouter.next(event.detail)
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error),
            })
        } finally {
            busy = false
        }
    }

    function previous(): void {
        backupRouter.previous()
    }
</script>

{#if $backupRoute === BackupRoutes.Init}
    <Transition>
        <Backup on:next={next} on:previous={previous} {busy} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoutes.RecoveryPhrase}
    <Transition>
        <RecoveryPhrase on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoutes.Verify}
    <Transition>
        <VerifyRecoveryPhrase on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoutes.Backup}
    <Transition>
        <BackupToFile on:next={next} on:previous={previous} {busy} strongholdPassword={$strongholdPassword} {locale} />
    </Transition>
{/if}

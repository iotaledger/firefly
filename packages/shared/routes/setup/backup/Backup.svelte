<script lang="typescript">
    import { Transition } from 'shared/components'
    import { Backup, BackupToFile, RecoveryPhrase, VerifyRecoveryPhrase } from './views/'
    import { Locale } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'
    import { backupRoute, BackupRouter, BackupRoute, FireflyEvent } from '@core/router'
    import { mnemonic, strongholdPassword } from '@contexts/onboarding'

    export let locale: Locale

    const backupRouter = new BackupRouter()

    let busy = false

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await backupRouter.next(event.detail)
        } catch (err) {
            console.error(err)
            showAppNotification({
                type: 'error',
                message: locale(err.error ?? 'error.global.generic'),
            })
        } finally {
            busy = false
        }
    }

    function previous(): void {
        backupRouter.previous()
    }
</script>

{#if $backupRoute === BackupRoute.Init}
    <Transition>
        <Backup on:next={next} on:previous={previous} {busy} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoute.RecoveryPhrase}
    <Transition>
        <RecoveryPhrase on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoute.Verify}
    <Transition>
        <VerifyRecoveryPhrase on:next={next} on:previous={previous} {busy} mnemonic={$mnemonic} {locale} />
    </Transition>
{:else if $backupRoute === BackupRoute.Backup}
    <Transition>
        <BackupToFile on:next={next} on:previous={previous} {busy} strongholdPassword={$strongholdPassword} {locale} />
    </Transition>
{/if}

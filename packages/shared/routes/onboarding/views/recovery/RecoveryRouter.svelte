<script lang="typescript">
    import { setContext } from 'svelte'
    import { Transition } from 'shared/components'
    import { BackupPasswordView, FileImportView, LedgerView, SuccessView, TextImportView } from './views'
    import { localize } from '@core/i18n'
    import { FireflyEvent, recoveryRoute, recoveryRouter, RecoveryRouter, RecoveryRoute } from '@core/router'
    import { showAppNotification } from '@lib/notifications'

    setContext<RecoveryRouter>('importRouter', $recoveryRouter)

    let busy = false
    let error = ''

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await $recoveryRouter.next(event.detail)
        } catch (err) {
            if (!err.snapshot) {
                if (err && err.name === 'KdbxError' && err.code === 'InvalidKey') {
                    error = localize('views.migrate.incorrectSeedVaultPassword')
                } else if (err && err.name === 'KdbxError' && err.code === 'FileCorrupt') {
                    error = localize('views.migrate.noDataSeedVault')
                } else if ($recoveryRoute === RecoveryRoute.TextImport) {
                    showAppNotification({
                        type: 'error',
                        message: localize('views.migrate.problemRestoringWallet'),
                    })
                } else {
                    error = localize(err.error)
                }
            }
        }
        busy = false
    }

    function previous(): void {
        $recoveryRouter.previous()
    }
</script>

{#if $recoveryRoute === RecoveryRoute.TextImport}
    <Transition>
        <TextImportView on:next={next} on:previous={previous} />
    </Transition>
{:else if $recoveryRoute === RecoveryRoute.FileImport}
    <Transition>
        <FileImportView on:next={next} on:previous={previous} />
    </Transition>
{:else if $recoveryRoute === RecoveryRoute.BackupPassword}
    <Transition>
        <BackupPasswordView on:next={next} on:previous={previous} {error} {busy} />
    </Transition>
{:else if $recoveryRoute === RecoveryRoute.LedgerImport}
    <Transition>
        <LedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $recoveryRoute === RecoveryRoute.Success}
    <Transition>
        <SuccessView on:next={next} on:previous={previous} />
    </Transition>
{/if}

<script lang="typescript">
    import { setContext } from 'svelte'
    import { Transition } from 'shared/components'
    import { BackupPasswordView, FileImportView, ImportView, LedgerView, SuccessView, TextImportView } from './views'
    import { localize } from '@core/i18n'
    import { FireflyEvent, importRoute, ImportRouter, ImportRoute } from '@core/router'
    import { showAppNotification } from '@lib/notifications'

    const importRouter = new ImportRouter()

    setContext<ImportRouter>('importRouter', importRouter)

    let busy = false
    let error = ''

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await importRouter.next(event.detail)
        } catch (err) {
            if (!err.snapshot) {
                if (err && err.name === 'KdbxError' && err.code === 'InvalidKey') {
                    error = localize('views.migrate.incorrectSeedVaultPassword')
                } else if (err && err.name === 'KdbxError' && err.code === 'FileCorrupt') {
                    error = localize('views.migrate.noDataSeedVault')
                } else if ($importRoute === ImportRoute.TextImport) {
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
        importRouter.previous()
    }
</script>

{#if $importRoute === ImportRoute.Init}
    <Transition>
        <ImportView on:next={next} on:previous={previous} />
    </Transition>
{:else if $importRoute === ImportRoute.TextImport}
    <Transition>
        <TextImportView on:next={next} on:previous={previous} />
    </Transition>
{:else if $importRoute === ImportRoute.FileImport}
    <Transition>
        <FileImportView on:next={next} on:previous={previous} />
    </Transition>
{:else if $importRoute === ImportRoute.LedgerImport}
    <Transition>
        <LedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $importRoute === ImportRoute.BackupPassword}
    <Transition>
        <BackupPasswordView on:next={next} on:previous={previous} {error} {busy} />
    </Transition>
{:else if $importRoute === ImportRoute.Success}
    <Transition>
        <SuccessView on:next={next} on:previous={previous} />
    </Transition>
{/if}

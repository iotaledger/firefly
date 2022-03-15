<script lang="typescript">
    import { setContext } from 'svelte'
    import { Transition } from 'shared/components'
    import { BackupPassword, FileImport, Import, Ledger, Success, TextImport } from './views/'
    import { Locale } from 'shared/lib/typings/i18n'
    import { importRoute, ImportRouter, ImportRoutes } from '@core/router'
    import { showAppNotification } from 'shared/lib/notifications'
    import { FireflyEvent } from '@core/router/typings/event'

    export let locale: Locale

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
                    error = locale('views.migrate.incorrectSeedVaultPassword')
                } else if (err && err.name === 'KdbxError' && err.code === 'FileCorrupt') {
                    error = locale('views.migrate.noDataSeedVault')
                } else if ($importRoute === ImportRoutes.TextImport) {
                    showAppNotification({
                        type: 'error',
                        message: locale('views.migrate.problemRestoringWallet'),
                    })
                } else {
                    error = locale(err.error)
                }
            }
        }
        busy = false
    }

    function previous(): void {
        importRouter.previous()
    }
</script>

{#if $importRoute === ImportRoutes.Init}
    <Transition>
        <Import on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoutes.TextImport}
    <Transition>
        <TextImport on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoutes.FileImport}
    <Transition>
        <FileImport on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoutes.LedgerImport}
    <Transition>
        <Ledger on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoutes.BackupPassword}
    <Transition>
        <BackupPassword on:next={next} on:previous={previous} {error} {locale} {busy} />
    </Transition>
{:else if $importRoute === ImportRoutes.Success}
    <Transition>
        <Success on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}

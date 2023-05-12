<script lang="typescript">
    import { setContext } from 'svelte'
    import { Transition } from 'shared/components'
    import { BackupPassword, FileImport, Import, Ledger, Success, TextImport } from './views/'
    import UpdateStrongholdRouter from '../../update-stronghold/UpdateStrongholdRouter.svelte'
    import { Locale } from '@core/i18n'
    import { FireflyEvent, importRoute, ImportRouter, ImportRoute } from '@core/router'
    import { showAppNotification } from 'shared/lib/notifications'

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
                } else if ($importRoute === ImportRoute.TextImport) {
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

{#if $importRoute === ImportRoute.Init}
    <Transition>
        <Import on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoute.TextImport}
    <Transition>
        <TextImport on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoute.FileImport}
    <Transition>
        <FileImport on:next={next} on:previous={previous} {locale} {busy} />
    </Transition>
{:else if $importRoute === ImportRoute.LedgerImport}
    <Transition>
        <Ledger on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $importRoute === ImportRoute.BackupPassword}
    <Transition>
        <BackupPassword on:next={next} on:previous={previous} bind:error {locale} {busy} />
    </Transition>
{:else if $importRoute === ImportRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdRouter parentRouter={importRouter} isRecovery={true} />
    </Transition>
{:else if $importRoute === ImportRoute.Success}
    <Transition>
        <Success on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}

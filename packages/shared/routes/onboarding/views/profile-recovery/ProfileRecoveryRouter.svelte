<script lang="typescript">
    import { setContext } from 'svelte'
    import { Transition } from 'shared/components'
    import {
        BackupPasswordView,
        ImportMnemonicPhraseView,
        ImportStrongholdBackupView,
        LedgerView,
        SuccessView,
    } from './views'
    import { localize } from '@core/i18n'
    import {
        profileRecoveryRoute,
        profileRecoveryRouter,
        ProfileRecoveryRouter,
        ProfileRecoveryRoute,
    } from '@core/router'
    import { showAppNotification } from '@lib/notifications'

    setContext<ProfileRecoveryRouter>('importRouter', $profileRecoveryRouter)
    $profileRecoveryRouter.resetRoute()

    let busy = false
    let error = ''

    async function next(): Promise<void> {
        busy = true
        try {
            await $profileRecoveryRouter.next()
        } catch (err) {
            if (!err.snapshot) {
                if ($profileRecoveryRoute === ProfileRecoveryRoute.ImportMnemonicPhrase) {
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
        $profileRecoveryRouter.previous()
    }
</script>

{#if $profileRecoveryRoute === ProfileRecoveryRoute.ImportMnemonicPhrase}
    <Transition>
        <ImportMnemonicPhraseView on:next={next} on:previous={previous} />
    </Transition>
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.ImportStrongholdBackup}
    <Transition>
        <ImportStrongholdBackupView on:next={next} on:previous={previous} />
    </Transition>
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.BackupPassword}
    <Transition>
        <BackupPasswordView on:next={next} on:previous={previous} {error} {busy} />
    </Transition>
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.LedgerImport}
    <Transition>
        <LedgerView on:next={next} on:previous={previous} />
    </Transition>
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.Success}
    <Transition>
        <SuccessView on:next={next} on:previous={previous} />
    </Transition>
{/if}

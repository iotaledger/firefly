<script lang="typescript">
    import { onMount } from 'svelte'
    import { BackupPasswordView, ImportMnemonicPhraseView, ImportStrongholdBackupView, SuccessView } from './views'
    import { localize } from '@core/i18n'
    import { profileRecoveryRoute, profileRecoveryRouter, ProfileRecoveryRoute } from '../../../../lib/routers'
    import { showAppNotification } from '@auxiliary/notification'

    let busy = false
    let error = ''

    function next(): void {
        busy = true
        try {
            $profileRecoveryRouter.next()
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
        $profileRecoveryRouter?.previous()
    }

    onMount(() => {
        $profileRecoveryRouter?.resetRoute()
    })
</script>

{#if $profileRecoveryRoute === ProfileRecoveryRoute.ImportMnemonicPhrase}
    <ImportMnemonicPhraseView on:next={next} on:previous={previous} />
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.ImportStrongholdBackup}
    <ImportStrongholdBackupView on:next={next} on:previous={previous} />
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.BackupPassword}
    <BackupPasswordView on:next={next} on:previous={previous} />
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.Success}
    <SuccessView on:next={next} on:previous={previous} />
{/if}

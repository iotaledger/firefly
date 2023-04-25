<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        ProfileRecoveryRoute,
        ProfileRecoveryRouter,
        profileRecoveryRoute,
        profileRecoveryRouter,
    } from '@core/router'
    import features from '@features/features'
    import { UpdateStrongholdRouter } from '@views'
    import { Transition } from 'shared/components'
    import { setContext } from 'svelte'
    import {
        BackupPasswordView,
        ImportMnemonicPhraseView,
        ImportStrongholdBackupView,
        LedgerView,
        SuccessView,
    } from './views'

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

    $: if (features.analytics.onboardingRoute.profileRecoveryRoute.enabled && $profileRecoveryRoute) {
        Platform.trackEvent('profile-recovery-route', { route: $profileRecoveryRoute })
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
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdRouter isRecovery />
    </Transition>
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.Success}
    <Transition>
        <SuccessView on:next={next} on:previous={previous} />
    </Transition>
{/if}

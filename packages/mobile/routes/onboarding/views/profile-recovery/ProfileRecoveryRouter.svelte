<script lang="typescript">
    import { setContext } from 'svelte'
    import { ImportMnemonicPhraseView, SuccessView } from './views'
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
    <ImportMnemonicPhraseView on:next={next} on:previous={previous} />
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.Success}
    <SuccessView on:next={next} on:previous={previous} />
{/if}

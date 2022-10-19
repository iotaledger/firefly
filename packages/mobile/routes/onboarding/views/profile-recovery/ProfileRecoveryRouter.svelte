<script lang="typescript">
    import { onMount } from 'svelte'
    import { ImportMnemonicPhraseView, SuccessView } from './views'
    import { localize } from '@core/i18n'
    import { profileRecoveryRoute, profileRecoveryRouter, ProfileRecoveryRoute } from '../../../../lib/core/router'
    import { showAppNotification } from '@lib/notifications'

    let busy = false
    let error = ''

    function next(): Promise<void> {
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
{:else if $profileRecoveryRoute === ProfileRecoveryRoute.Success}
    <SuccessView on:next={next} on:previous={previous} />
{/if}

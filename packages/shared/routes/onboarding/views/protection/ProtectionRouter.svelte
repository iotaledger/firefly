<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { localize } from '@core/i18n'
    import { FireflyEvent, protectionRoute, protectionRouter, ProtectionRoute } from '@core/router'
    import { showAppNotification } from '@lib/notifications'

    let busy = false

    function next(event: CustomEvent<FireflyEvent>): void {
        busy = true
        try {
            $protectionRouter.next(event?.detail)
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        busy = false
    }

    function previous(): void {
        $protectionRouter.previous()
    }
</script>

{#if $protectionRoute === ProtectionRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} on:next={next} on:previous={previous} />
    </Transition>
{/if}

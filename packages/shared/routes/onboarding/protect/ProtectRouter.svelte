<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetupPinProtectionView } from './views'
    import { localize } from '@core/i18n'
    import { FireflyEvent, protectRoute, ProtectRouter, ProtectRoute } from '@core/router'
    import { showAppNotification } from '@lib/notifications'

    const protectRouter = new ProtectRouter()

    let busy = false

    function next(event: CustomEvent<FireflyEvent>): void {
        busy = true
        try {
            protectRouter.next(event?.detail)
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        busy = false
    }

    function previous(): void {
        protectRouter.previous()
    }
</script>

{#if $protectRoute === ProtectRoute.SetupPinProtection}
    <Transition>
        <SetupPinProtectionView {busy} on:next={next} on:previous={previous} />
    </Transition>
{/if}

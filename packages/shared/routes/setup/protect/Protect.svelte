<script lang="typescript">
    import { Transition } from 'shared/components'
    import { Pin, RepeatPin } from './views'
    import { walletPin } from '@lib/app'
    import { Locale } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'
    import { FireflyEvent, protectRoute, ProtectRouter, ProtectRoute } from '@core/router'

    export let locale: Locale

    const protectRouter = new ProtectRouter()

    let busy = false

    async function next(event: CustomEvent<FireflyEvent>): Promise<void> {
        busy = true
        try {
            await protectRouter.next(event?.detail)
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error),
            })
        }
        busy = false
    }

    function previous(): void {
        protectRouter.previous()
    }
</script>

{#if $protectRoute === ProtectRoute.Pin}
    <Transition>
        <Pin {busy} on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $protectRoute === ProtectRoute.RepeatPin}
    <Transition>
        <RepeatPin {busy} on:next={next} on:previous={previous} pinCandidate={$walletPin} {locale} />
    </Transition>
{/if}

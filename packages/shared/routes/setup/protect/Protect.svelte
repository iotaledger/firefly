<script lang="typescript">
    import { Transition } from 'shared/components'
    import { Pin, RepeatPin } from './views/'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Locale } from 'shared/lib/typings/i18n'
    import { protectRoute, ProtectRouter, ProtectRoutes } from '@core/router'
    import { FireflyEvent } from '@core/router/typings/event'

    export let locale: Locale

    const protectRouter = new ProtectRouter()

    let busy = false

    $: switch ($protectRoute) {
        case ProtectRoutes.Init:
        case ProtectRoutes.Pin:
            protectRouter.pin = null
            break
    }

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

{#if $protectRoute === ProtectRoutes.Pin}
    <Transition>
        <Pin {busy} on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $protectRoute === ProtectRoutes.RepeatPin}
    <Transition>
        <RepeatPin {busy} on:next={next} on:previous={previous} pinCandidate={protectRouter.pin} {locale} />
    </Transition>
{/if}

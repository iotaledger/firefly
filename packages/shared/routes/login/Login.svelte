<script lang="typescript">
    import { loginRoute, LoginRouter, LoginRoutes } from '@core/router'
    import { FireflyEvent } from '@core/router/typings/event'

    import { Transition } from 'shared/components'
    import { activeProfileId, clearActiveProfile, profiles } from 'shared/lib/profile'
    import { Locale } from 'shared/lib/typings/i18n'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { EnterPin, SelectProfile } from './views/'

    export let locale: Locale

    const loginRouter = new LoginRouter()

    onMount(() => {
        if (get(activeProfileId) && get(profiles)?.find((p) => p.id === get(activeProfileId))) {
            loginRouter.next()
        } else {
            clearActiveProfile()
        }
    })

    const next = (event: CustomEvent<FireflyEvent>): void => loginRouter.next(event.detail)
    const previous = (): void => loginRouter.previous()
</script>

{#if $loginRoute === LoginRoutes.Init}
    <Transition>
        <SelectProfile on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $loginRoute === LoginRoutes.EnterPin}
    <Transition>
        <EnterPin on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}

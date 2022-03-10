<script lang="typescript">
    import { LoginRoutes } from '@core/router'
    import { loginRoute, LoginRouter } from '@core/router/loginRouter'

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

    const next = (event: CustomEvent): void => loginRouter.next(event)
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

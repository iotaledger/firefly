<script lang="typescript">
    import { onMount } from 'svelte'
    import { setupI18n, isLocaleLoaded, dir, _ } from '@shared-lib/i18n'
    import { darkMode, mobile } from '@shared-lib/app'
    import { goto } from '@shared-lib/helpers'
    import { Route } from '@shared-components'
    import { Splash, Onboarding1, Legal, Setup, Password, Protect, Pin } from '@shared-routes'

    let splash = true
    mobile.set(false)

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    setupI18n()
    goto('') // dummmy goto homepage
    onMount(() => {
        setTimeout(() => {
            splash = false
            goto('onboarding-1')
        }, 2000)
    })
</script>

<style global type="text/scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>

{#if !$isLocaleLoaded || splash}
    <Route route="">
        <Splash />
    </Route>
{:else}
    <Route route="onboarding-1">
        <Onboarding1 mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="legal">
        <Legal mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="setup">
        <Setup mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="password">
        <Password mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="protect">
        <Protect mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="pin">
        <Pin mobile={$mobile} locale={$_} {goto} />
    </Route>
{/if}

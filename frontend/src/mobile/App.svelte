<script lang="typescript">
    import { onMount } from 'svelte'
    import { setupI18n, isLocaleLoaded, dir, _ } from '@shared-lib/i18n'
    import { darkMode, mobile } from '@shared-lib/app'
    import { goto } from '@shared-lib/helpers'
    import { Route } from '@shared-components'
    import { Splash, Onboarding1 } from '@shared-routes'

    let splash = true

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    setupI18n()
    goto('') // dummmy goto homepage
    onMount(() => {
        setTimeout(() => {
            splash = false
            goto('ob1')
        }, 2000)
    })
</script>

<style type="text/scss">
</style>

{#if !$isLocaleLoaded || splash}
    <Route route="">
        <Splash />
    </Route>
{:else}
    <Route route="ob1">
        <Onboarding1 mobile={$mobile} locale={$_} />
    </Route>
{/if}

<script lang="typescript">
    import { onMount } from 'svelte'
    import { setupI18n, isLocaleLoaded, dir, _ } from 'shared-modules/lib/i18n'
    import { darkMode } from 'shared-modules/lib/app'
    import { Route } from 'shared-modules/components'
    import { Splash } from 'shared-modules/routes'

    let splash = true

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    setupI18n()

    onMount(() => {
        setTimeout(() => {
            splash = false
        }, 2000)
    })
</script>

<style type="text/scss">
</style>

<main>
    {#if !$isLocaleLoaded || splash}
        <Route route="">
            <Splash />
        </Route>
    {:else}
        <h1>{$_('app.title')}</h1>
    {/if}
</main>

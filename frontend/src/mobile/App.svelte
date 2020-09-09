<script lang="typescript">
    import { setupI18n, isLocaleLoaded, dir, _, darkMode } from 'shared-modules'

    setupI18n()

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }
</script>

<style type="text/scss">

</style>

{#if $isLocaleLoaded}
    <main>
        <h1>{$_('app.title')}</h1>
    </main>
{:else}
    <p>Loading locale...</p>
{/if}

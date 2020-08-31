<script>
    import { setupI18n, isLocaleLoaded, dir, _ } from 'shared-modules/lib/i18n.js'
    import { darkMode } from 'shared-modules/lib/app'
    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')

    setupI18n()
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }
</script>

<style type="text/scss">
    @import 'shared-modules/style/style.scss';
</style>

{#if $isLocaleLoaded}
    <main>
        <h1>{$_('app.title')}</h1>
    </main>
{:else}
    <p>Loading locale...</p>
{/if}

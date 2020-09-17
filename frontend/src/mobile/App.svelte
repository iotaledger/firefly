<script lang="typescript">
    import { setupI18n, isLocaleLoaded, dir, _, darkMode } from '../shared'

    import PluginRenderer from './ui/components/PluginRenderer.svelte'
    import SamplePluginDefinition from './lib/plugins/definitions/sample.json'

    const plugins = [
        {
            definition: SamplePluginDefinition,
            parameters: {
                button: {
                    getAddress: [0]
                }
            }
        }
    ]

    setupI18n()

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }
</script>

<style type="text/scss">

</style>

{#if true}
    <main>
        <h1>{$_('app.title')}</h1>
        <PluginRenderer definition={plugins[0].definition} parameters={plugins[0].parameters} />
    </main>
{:else}
    <p>Loading locale...</p>
{/if}

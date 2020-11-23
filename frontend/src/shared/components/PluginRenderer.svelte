<script lang="typescript">
    import Plugin from '@shared-lib/plugins'
    import { PluginPartial } from '@shared-components'

    export let definition, parameters

    let plugin

    try {
        // Initialise plugin
        plugin = new Plugin(definition)

        // Set parameters
        plugin.state.update((state) => {
            return Object.keys(state).reduce((acc, prop) => {
                if (prop in parameters) {
                    acc = Object.assign({}, acc, {
                        [prop]: parameters[prop]
                    })
                } else {
                    acc = state[prop]
                }

                return acc
            }, {})
        })

        // (Added for debugging) Logs plugin state whenever it gets updated
        plugin.state.subscribe((s) => {
            console.info('Updated state:', s)
        })
    } catch (e) {
        console.error(e)
    }
</script>

<PluginPartial components={plugin.modules} />

<script lang="typescript">
    import Plugin from '../../lib/plugins'

    export let definition, parameters

    let plugin, error

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
        error = e
    }
</script>

<main>
    {#if error}
        <span style="color: red">{error}</span>
    {:else}
        {#each plugin.modules as item}
            <svelte:component this={item.component} {...item.props} events={item.events}>
                {#if item.children.length}
                    {#each item.children as child}
                        <svelte:component this={child.component} {...child.props} events={child.events}>
                            {child.content}
                        </svelte:component>
                    {/each}
                {:else}{item.content}{/if}

            </svelte:component>
        {/each}
    {/if}
</main>

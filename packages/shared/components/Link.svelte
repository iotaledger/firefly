<script lang="typescript">
    import { Icon } from 'shared/components'
    import { bindEvents } from 'shared/lib/utils'
    export let events = {}

    export let onClick = () => ''
    export let href = undefined
    export let secondary = false
    export let disabled = false
    export let ghost = false
    export let classes = ''
    export let icon = undefined
</script>

<a
    class="text-12 leading-140 flex flex-row items-center cursor-pointer text-blue-500 {classes}"
    data-label="link"
    use:bindEvents={events}
    {href}
    on:click={onClick}
    class:secondary
    class:disabled
    class:ghost>
    {#if icon}
        <Icon {icon} classes="text-blue-500 mr-2" />
    {/if}
    <slot />
</a>

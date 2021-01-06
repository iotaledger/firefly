<script>
    import { Text } from 'shared/components'

    export let width = '76px'
    export let height = '76px'
    export let classes = undefined

    export let bgColor = '#108CFF'
    export let name = ''
    export let onClick = () => ''

    let slots = $$props.$$slots

    function getInitials() {
        const names = name.split(' ')

        let initials = names[0].substring(0, 1).toUpperCase()

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase()
        }

        return initials
    }
</script>

<div class="flex flex-col justify-between items-center">
    <div
        on:click={onClick}
        class={`font-bold text-white text-center rounded-full flex items-center justify-center cursor-pointer ${classes}`}
        style={`height: ${height}; width: ${width}; background-color: ${bgColor}`}>
        {#if slots}
            <slot />
        {:else}{getInitials()}{/if}
    </div>
    <Text type="h4" bold classes="mt-8">{name}</Text>
</div>

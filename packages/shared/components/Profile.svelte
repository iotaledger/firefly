<script>
    import { Text } from 'shared/components'

    export let classes = undefined
    export let locale

    export let name = ''
    export let id = ''
    export let isDeveloper = false
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

<div class="flex items-center justify-center h-full">
    <div class="flex flex-col justify-between items-center">
        <div
            on:click={() => onClick(id)}
            class={`h-32 w-32 bg-blue-500 rounded-full font-bold text-center flex items-center justify-center cursor-pointer ${classes}`}
        >
            {#if slots}
                <slot />
            {:else}
                <Text type="h2" classes="text-white">{getInitials()}</Text>
            {/if}
        </div>
        <Text type="h4" classes="mt-5">{name}</Text>
    </div>
    {#if isDeveloper}
        <div class={'bg-blue-500 rounded-lg px-2 py-1 absolute top-20'}>
            <Text type="h4" classes="text-white">{locale('general.dev').toUpperCase()}</Text>
        </div>
    {/if}
</div>
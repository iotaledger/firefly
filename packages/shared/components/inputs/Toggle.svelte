<script lang="typescript">
    export let active = false
    export let classes = ''
    export let color = 'blue'
    export let disabled = false

    export let onClick = (): void => {}

    function handleClick(): void {
        if (!disabled && onClick) {
            onClick()
        }
    }
</script>

<toggle
    on:click={handleClick}
    class:active
    disabled
    class="
        relative block w-10 flex-shrink-0 h-6 rounded-full border-solid border border-transparent dark:border-gray-700 
        {disabled ? 'opacity-40' : 'cursor-pointer'}
        {active ? `bg-${color}-500` : 'bg-gray-200 dark:bg-gray-900'} 
        {classes}"
>
    <knob class="absolute top-1/2 transform -translate-y-1/2 left-1 h-4 w-4 rounded-full bg-white dark:bg-gray-800" />
</toggle>

<style type="text/scss">
    toggle {
        knob {
            transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        &.active {
            knob {
                left: 20px;
            }
        }
    }
</style>

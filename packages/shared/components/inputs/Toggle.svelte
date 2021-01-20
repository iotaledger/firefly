<script>
    export let value = undefined
    export let storeItem = undefined
    export let label = ''
    export let classes = ''

    $: active = value === true || $storeItem === true

    function onClick() {
        if (value) {
            value = !value
        } else if (storeItem) {
            storeItem.update((storeItem) => !storeItem)
        }
    }
</script>

<style type="text/scss">
    knob {
        transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        &.active {
            left: 20px;
        }
    }
</style>

<label class={`w-full flex items-center mb-4 text-12 leading-160 text-gray-800 dark:text-white ${classes}`}>
    <toggle on:click={onClick} class="relative block mr-5 w-10 h-6 rounded-full bg-gray-300">
        <knob class:active class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white" />
    </toggle>
    {label}
</label>

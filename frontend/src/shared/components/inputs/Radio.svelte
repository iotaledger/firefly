<script>
    export let value = undefined
    export let group = undefined
    export let label = ''
    export let classes = ''
</script>

<style type="text/scss">
    input {
        @apply mr-8;
    }
</style>

<label class={`w-full flex items-center mb-4 text-12 leading-160 text-gray-800 dark:text-white ${classes}`}>
    <input type="radio" bind:group {value} />
    {label}
</label>

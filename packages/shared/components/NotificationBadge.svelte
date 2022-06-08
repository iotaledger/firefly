<script lang="typescript">
    export let innerColor = 'red-600'
    export let borderColor = 'white'
    export let darkBorderColor = 'gray-800'
</script>

<span class="absolute top-0 right-0 flex justify-center items-center h-3 w-3">
    <span
        class="h-2 w-2 rounded-full box-content border-2 border-solid border-{borderColor} dark:border-{darkBorderColor} bg-{innerColor}"
    />
</span>

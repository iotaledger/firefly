<script lang="typescript">
    export let innerColor = 'blue-500'
    export let outerColor = 'blue-500'
</script>

<span class="absolute -top-2 -left-2 flex justify-center items-center h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-{outerColor} opacity-75" />
    <span class="relative inline-flex rounded-full h-2 w-2 bg-{innerColor}" />
</span>

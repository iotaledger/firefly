<script lang="ts">
    export let innerColor = 'blue-500'
    export let outerColor = 'blue-500'
    export let classes = ''
</script>

<pinging-badge class="flex justify-center items-center h-3 w-3 {classes}">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-{outerColor} opacity-75" />
    <span class="relative inline-flex rounded-full h-2 w-2 bg-{innerColor}" />
</pinging-badge>

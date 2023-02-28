<script lang="ts">
    export let innerColor = 'red-600'
    export let borderColor = 'white'
    export let darkBorderColor = 'gray-800'
</script>

<notification-badge class="absolute top-0 right-0 flex justify-center items-center h-3 w-3">
    <span class="h-2 w-2 rounded-full ring-2 ring-{borderColor} dark:ring-{darkBorderColor} bg-{innerColor}" />
</notification-badge>

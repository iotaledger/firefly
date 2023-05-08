<script lang="ts">
    import { Icon } from 'shared/components'

    export let width = 38
    export let height = 38
</script>

<warning-badge
    class="absolute flex items-center justify-center right-0 bottom-0 w-5 h-5 rounded-full text-yellow-700 ring-4 ring-white dark:ring-gray-900"
>
    <Icon icon="exclamation-filled" {width} {height} />
</warning-badge>

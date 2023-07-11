<script lang="ts">
    import { Height, Overflow } from './enums'

    export let overflow: Overflow = Overflow.Hidden
    export let height: Height = Height.Auto

    function getOverflowClass(overflow: Overflow): string {
        return `overflow-${overflow}`
    }

    function getHeightClass(height: Height): string {
        return `h-${height}`
    }
</script>

<div
    class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-elevation-1
    {getOverflowClass(overflow)} {getHeightClass(height)}"
>
    <slot />
</div>

<script lang="ts">
    import { Height, Overflow } from './enums'

    export let overflow: Overflow = Overflow.Hidden
    export let height: Height = Height.Auto
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-elevation-1 {overflow} {height}">
    <slot />
</div>

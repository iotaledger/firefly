<script lang="ts">
    import { Height, Overflow, Width } from './enums'

    export let overflow: Overflow = Overflow.Hidden
    export let height: Height = Height.Auto
    export let width: Width = Width.Auto
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-elevation-1 {overflow} {height} {width}">
    <slot />
</div>

<script lang="ts">
    export let color: string
    export let size: number = 12
</script>

<colored-circle class="self-center rounded-full" style:--size="{size}px" style:--color={color} />

<style lang="scss">
    colored-circle {
        background-color: var(--color);
        color: var(--color);
        width: var(--size);
        height: var(--size);
    }
</style>

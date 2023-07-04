<script lang="ts">
    export let color: string
    export let size: number = 3
</script>

<colored-circle class="self-center rounded-full w-{size} h-{size}" style:--color={color} />

<style type="text/scss">
    colored-circle {
        background-color: var(--color);
        color: var(--color);
    }
</style>

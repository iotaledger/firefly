<script lang="typescript">
    export let color = false
    export let size: number = 3
</script>

<div class="circle self-center rounded-full w-{size} h-{size}" style="--color: {color};" />

<style type="text/scss">
    .circle {
        background-color: var(--color);
    }
</style>

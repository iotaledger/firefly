<script lang="typescript">
    export let classes = ''
</script>

<style type="text/scss">
    tooltip {
        max-width: 15rem;
    }
</style>

<tooltip class="py-4 px-6 top-0 right-6 w-max shadow-lg rounded-xl bg-white cursor-pointer absolute text-center z-10 {classes}">
    <slot />
</tooltip>

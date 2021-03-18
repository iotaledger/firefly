<script lang="typescript">
    export let classes
</script>

<style>
    div {
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    }
</style>

<div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden {classes}">
    <slot />
</div>

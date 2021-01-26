<script>
    export let classes
</script>

<style>
    div {
        box-shadow: 0px 1px 2px 2px rgba(154, 173, 206, 0.1);
    }
</style>

<div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden {classes}">
    <slot />
</div>

<script>
    export let value = undefined
    export let classes = ''
</script>

<style type="text/scss">
    textarea {
        min-height: 200px;
    }
</style>

<!-- TODO: detect seed or mnemonic and style accordingly -->
<textarea
    class="text-12 leading-140 resize-none w-full p-4 pb-3 rounded-xl	border border-solid border-gray-300 bg-white text-gray-800"
    bind:value
    placeholder="" />

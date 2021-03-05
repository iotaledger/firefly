<script lang="typescript">
    export let percent = ''
    export let classes = ''
    export let message = ''
</script>

<style type="text/scss">
    div,
    .progress {
        height: 48px;
    }

    .progress {
        transition: width 0.25s;
    }
</style>

<div class={`relative flex justify-center items-center border border-solid rounded-2xl border-gray-300 ${classes}`}>
    <span
        class="absolute left-0 inline-block bg-blue-200 progress rounded-2xl"
        style={`width:${Math.max(Math.min(percent, 100), 0)}%`} />
    <span class="text-12 text-blue-500 z-10">{message}</span>
</div>

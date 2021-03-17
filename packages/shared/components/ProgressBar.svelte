<script lang="typescript">
    export let percent = 0
    export let classes = ''
    export let message = ''
    export let secondary = false
</script>

<style type="text/scss">
    div,
    .progress {
        height: 48px;
    }
    .progress {
        transition: width 0.25s;
    }
    .message {
        z-index: 1;
    }
</style>

<div class="relative flex justify-center items-center  { secondary ? 'border border-solid border-gray-300' : 'bg-blue-500'} rounded-2xl {classes}">
    <span
        class="absolute left-0 inline-block {secondary ? 'bg-blue-200' : 'bg-yellow-500'} progress rounded-2xl"
        style={`width:${Math.max(Math.min(percent, 100), 0)}%`} />
    <span class="font-bold text-12 {secondary ? 'text-blue-500' : 'text-white'} message">{message}</span>
</div>
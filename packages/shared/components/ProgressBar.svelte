<script lang="typescript">
    export let width = 0
    export let classes = ''
    export let message = ''
</script>

<style type="text/scss">
    div,
    .progress {
        height: 3rem;
        z-index: 1;
    }
    .progress {
        -webkit-transition: width 1s ease-in-out;
        -moz-transition: width 1s ease-in-out;
        -o-transition: width 1s ease-in-out;
        transition: width 1s ease-in-out;
    }
    .message {
        z-index: 2;
    }
</style>

<div class={`relative flex justify-center items-center bg-blue-500 rounded-2xl ${classes}`}>
    <span class="absolute left-0 inline-block bg-yellow-500 progress rounded-2xl w-1/2" style="width: {width}%"/>
    <span class="text-12 text-white font-bold message">{message}</span>
</div>

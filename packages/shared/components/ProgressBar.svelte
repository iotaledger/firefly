
<script lang="typescript">
    export let percent = 0
    export let classes = ''
    export let message = ''
    export let secondary = false

</script>

<style type="text/scss">
    .progress-container,
    .progress {
        height: 48px;
        @apply bg-blue-500;
        @apply border-0;
    }
    .progress {
        @apply bg-yellow-500;
        -webkit-transition: width 1s ease-in-out;
        -moz-transition: width 1s ease-in-out;
        -o-transition: width 1s ease-in-out;
        transition: width 1s ease-in-out;
    }
    .message {
        z-index: 1;
        @apply text-white;
    }
    .secondary.progress-container{
            @apply border-gray-200;
            @apply bg-white;
        }
    .secondary{
        .progress{
            @apply bg-blue-200;
        }
        .message {
            @apply text-blue-500;
        }
    }
</style>

<div class={`progress-container relative flex justify-center items-center border border-solid rounded-2xl overflow-hidden ${classes}`}
class:secondary>
    <span
        class="absolute left-0 inline-block progress rounded-2xl"
        style="width: {percent}%" />
    <span class="text-12  font-bold message">{message}</span>
</div>

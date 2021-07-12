<script lang="typescript">
    export let pattern, classes, width, height, onClick
</script>

<div
    class="{classes} bg-no-repeat bg-center bg-cover bg cursor-pointer"
    width={width || '100%'}
    height={height || '100%'}
    style={`background-image: url("assets/patterns/${pattern}.svg");`}
    on:click={onClick}></div>

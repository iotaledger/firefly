<script lang="typescript">
    export let pattern, classes, onClick
</script>

<div
    class="{classes} bg-no-repeat bg-center bg-cover bg cursor-pointer"
    style={`background-image: url("assets/patterns/${pattern}.svg");`}
    on:click={onClick}></div>

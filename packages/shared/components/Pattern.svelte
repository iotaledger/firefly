<script lang="typescript">
    export let pattern, classes, width, height
</script>

<img
    data-label="pattern"
    class={classes}
    width={width || '100%'}
    height={height || '100%'}
    src={`assets/patterns/${pattern}.svg`}
    alt="{pattern}" />

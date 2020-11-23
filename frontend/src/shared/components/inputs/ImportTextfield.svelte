<script>
    export let value = undefined
    export let classes = ''
</script>

<style type="text/scss">
    div {
        display: flex;
        position: relative;
        textarea {
            resize: none;
            min-height: 200px;
            width: 100%;
            padding: 19px 50px 19px 13px;
            color: var(--text-secondary-color);
            background: var(--element-bg-color);
            border-color: var(--line-separator-color);
            border-radius: 10px;
            box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
            font-size: 12px;
            line-height: 140%;
            font-weight: 700;
        }
    }
</style>

<div data-label="import-text-input" class={classes}><textarea bind:value placeholder="" /></div>

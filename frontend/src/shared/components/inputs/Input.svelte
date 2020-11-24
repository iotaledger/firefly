<script>
    export let value = ''
    export let classes = ''
    export let placeholder = ''
    export let type = 'text'

    const handleInput = (event) => {
        value = event.target.value
    }
</script>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input {
        padding: 15px 40px 16px 13px;
        color: var(--text-secondary-color);
        background: var(--element-bg-color);
        border-color: var(--line-separator-color);
        border-radius: 10px;
        box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
    }
</style>

<input
    {type}
    {value}
    class={`w-full relative border border-solid text-12 leading-140 font-bold ${classes}`}
    on:input={handleInput}
    {placeholder} />

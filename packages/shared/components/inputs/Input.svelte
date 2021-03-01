<script>
    import Error from './Error'
    export let value = ''
    export let classes = ''
    export let placeholder = ''
    export let type = 'text'
    export let error
    export let maxlength
    export let numeric = false

    const handleInput = (event) => {
        value = event.target.value
    }

    function onKeyPress(event) {
        // if the input is numeric, we accept only numbers and enter press
        if (numeric && event.keyCode !== 13 && (event.which < 48 || event.which > 57)) {
            event.preventDefault()
        }
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
        border-radius: 10px;
        box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
    }
</style>

<div class={'w-full'}>
    <input
        {type}
        {value}
        {maxlength}
        class={`w-full relative text-12 leading-140 py-4 pr-8 pl-4 bg-white border border-solid ${classes} ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-500 focus:border-gray-500'} rounded-xl text-gray`}
        on:input={handleInput}
        on:keypress={onKeyPress}
        {placeholder} 
        {...$$restProps}
    />
    <Error error={error}/>
</div>
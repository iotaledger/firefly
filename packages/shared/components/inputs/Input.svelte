<script lang="typescript">
    import { onMount } from 'svelte'

    export let value = ''
    export let classes = ''
    export let placeholder = ''
    export let type = 'text'
    export let autofocus = false

    let inputElement

    const handleInput = (event) => {
        value = event.target.value
    }

    onMount(() => {
        if (autofocus) {
            inputElement.focus()
        }
    })
</script>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input {
        padding: 15px 40px 16px 13px;
        transition: border-color 0.25s;
    }
</style>

<input
    {type}
    {value}
    bind:this={inputElement}
    class={`w-full relative bg-white border border-solid border-gray-300 hover:border-gray-500 focus:border-gray-500 rounded-xl text-gray text-12 leading-140 font-bold ${classes}`}
    on:input={handleInput}
    {placeholder} />

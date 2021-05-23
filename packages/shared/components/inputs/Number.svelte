<script lang="typescript">
    import { Icon } from 'shared/components'
    import { onMount } from 'svelte'

    export let value = undefined
    export let autofocus = false
    export let min = 0
    export let max = 2147483647

    let input

    onMount(() => {
        if (autofocus) {
            input.focus()
        }
    })

    function onInput(event) {
        const element = event.currentTarget as HTMLInputElement
        let _value: string = element.value
        validate(parseInt(_value))
    }

    function validate(_value) {
        if (isNaN(_value)) {
            return
        }

        _value = _value.toString().replace(/\D/g, '')
        _value = parseInt(_value)

        if (typeof min === 'number') {
            _value = Math.max(_value, min)
        }

        if (typeof max === 'number') {
            _value = Math.min(_value, max)
        }

        value = _value
    }
</script>

<button on:click={() => validate(value + 1)}>+</button>
<input bind:this={input} type="number" pattern="[0-9]" on:input={onInput} {value} />
<button on:click={() => validate(value - 1)}>-</button>

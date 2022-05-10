<script lang="typescript">
    import { Dropdown2 } from 'shared/components'
    import { Unit } from '@iota/unit-converter'

    export let unit: string
    export let isFocused: boolean

    let items = []
    $: {
        items = []
        const values = Object.values(Unit)
        for (let i = 0; i < values.length - 2; i++) {
            items.push({ value: values[i], label: values[i] })
        }
    }

    function onSelect(selected) {
        unit = selected.value
    }
</script>

<Dropdown2 bind:isFocused value={unit} {items} {onSelect} contentWidth small />

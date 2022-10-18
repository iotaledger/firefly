<script lang="typescript">
    import { Input } from 'shared/components'

    export let key = ''
    export let value = ''
    export let error = ''
    export let disabled = false

    const placeholder = key
</script>

<key-value>
    <Input label={key} bind:value {disabled} {error} {placeholder} inputElement={undefined} classes="mb-6" />
</key-value>

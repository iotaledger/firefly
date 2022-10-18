<script lang="typescript">
    import { Input } from 'shared/components'

    export let key = ''
    export let value = ''
    export let error = ''
</script>

<key-value>
    <Input label={key} bind:value {error} inputElement={undefined} classes="mb-6" />
</key-value>

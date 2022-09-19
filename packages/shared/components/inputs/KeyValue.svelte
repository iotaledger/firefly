<script lang="typescript">
    import { Input } from 'shared/components'

    export let key = ''
    export let value = ''
</script>

<key-value>
    <Input label={key} bind:value error={''} disabled={true} inputElement={undefined} classes="mb-6" />
</key-value>

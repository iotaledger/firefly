<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Modal } from 'shared/components'

    let modal: Modal
    let value
    let selected: 'none' | '1hour' | '1day' | '1week' = 'none'
</script>

<button class="flex items-center justify-center cursor-pointer" on:click={modal?.open}>
    <Text highlighted classes="hover:text-blue-600">
        {value}
    </Text>
</button>
<ExpirationTimePickerMenu bind:modal bind:value bind:selected />

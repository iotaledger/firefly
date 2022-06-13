<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Modal } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    export let value: Date
    let modal: Modal
    let selected: 'none' | '1hour' | '1day' | '1week' = 'none'
</script>

<button class="flex items-center justify-center cursor-pointer" on:click={modal?.open}>
    <Text highlighted classes="hover:text-blue-600">
        {value
            ? formatDate(value, {
                  dateStyle: 'long',
                  timeStyle: 'medium',
              })
            : localize('general.none')}
    </Text>
</button>
<ExpirationTimePickerMenu bind:modal bind:value bind:selected />

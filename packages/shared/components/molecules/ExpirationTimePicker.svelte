<script lang="typescript">
    import { Text, ExpirationTimePickerMenu, Modal } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'

    export let value: Date

    let menu: ExpirationTimePickerMenu
    let selected: 'none' | '1hour' | '1day' | '1week' = 'none'
    let anchor: HTMLElement
</script>

<button class="flex items-center justify-center cursor-pointer" on:click={menu?.tryOpen} bind:this={anchor}>
    <Text highlighted classes="hover:text-blue-600">
        {value
            ? formatDate(value, {
                  dateStyle: 'long',
                  timeStyle: 'medium',
              })
            : localize('general.none')}
    </Text>
</button>
<ExpirationTimePickerMenu bind:this={menu} bind:value bind:selected bind:anchor />

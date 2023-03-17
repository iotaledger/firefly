<script lang="ts">
    import { formatDate } from '@core/i18n'
    import { Text, DateTimePicker, Icon } from 'shared/components'
    import { appSettings } from '@core/app'

    export let value: string = undefined

    let customDate: Date
    let anchor: HTMLElement
    let canShowDateTimePicker: boolean = false

    $: formattedDate = value ? formatDate(new Date(value), { dateStyle: 'short', locale: $appSettings.language }) : ''

    function onCancelExpirationTimeClick(): void {
        canShowDateTimePicker = false
    }

    function onConfirmExpirationTimeClick(): void {
        value = customDate.toString()
        canShowDateTimePicker = false
    }

    function onShowDateTimePickerClick(): void {
        canShowDateTimePicker = true
    }
</script>

<button
    bind:this={anchor}
    on:click={onShowDateTimePickerClick}
    class="flex flex-row justify-between border border-solid border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-500 dark:hover:border-gray-700 text-center rounded-xl px-2 py-1"
>
    <Icon width="20" height="20" classes="text-gray-500" icon="calendar" />
    <Text>{formattedDate}</Text>
</button>
{#if canShowDateTimePicker}
    <DateTimePicker
        position="top"
        {anchor}
        mode="date"
        bind:value={customDate}
        on:cancel={onCancelExpirationTimeClick}
        on:confirm={onConfirmExpirationTimeClick}
    />
{/if}

<style lang="scss">
    button {
        width: 93px;
    }
</style>

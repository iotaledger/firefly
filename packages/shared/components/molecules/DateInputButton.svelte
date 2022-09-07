<script lang="typescript">
    import { formatDate } from '@core/i18n'
    import { Text, DateTimePicker, Icon } from 'shared/components'
    import { appSettings } from '@core/app'

    export let value: Date

    let customDate: Date
    let anchor: HTMLElement
    let canShowDateTimePicker: boolean = false

    $: formattedDate = value ? formatDate(value, { dateStyle: 'short', locale: $appSettings.language }) : ''

    function handleExpirationTimeCancelClick(): void {
        canShowDateTimePicker = false
    }

    function handleExpirationTimeConfirmClick(): void {
        value = customDate
        canShowDateTimePicker = false
    }
</script>

<button
    bind:this={anchor}
    on:click={() => (canShowDateTimePicker = true)}
    class="flex flex-row justify-between border border-solid border-gray-300 bg-white text-center rounded-xl px-2 py-1"
>
    <Icon width="20" height="20" classes="text-gray-500" icon="calendar" />
    <Text fontSize="11">{formattedDate}</Text>
</button>
{#if canShowDateTimePicker}
    <DateTimePicker
        position="top"
        {anchor}
        mode="date"
        bind:value={customDate}
        on:cancel={() => handleExpirationTimeCancelClick()}
        on:confirm={() => handleExpirationTimeConfirmClick()}
    />
{/if}

<script lang="ts">
    import { Icon, Text } from '@ui'

    import { appSettings } from '@core/app'
    import { formatDate } from '@core/i18n'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let value: string = undefined
    export let onConfirm: (value: string) => void = () => {}

    let anchor: HTMLElement

    $: formattedDate = value ? formatDate(new Date(value), { dateStyle: 'short', locale: $appSettings.language }) : ''

    function handleShowDateTimePickerClick(): void {
        openDrawer(DrawerId.DateTimePicker, { onConfirm, mode: 'date' })
    }
</script>

<button
    bind:this={anchor}
    on:click={handleShowDateTimePickerClick}
    class="flex flex-row justify-between border border-solid border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-500 dark:hover:border-gray-700 text-center rounded-xl px-2 py-1"
>
    <Icon width="20" height="20" classes="text-gray-500" icon={IconEnum.Calendar} />
    <Text>{formattedDate}</Text>
</button>

<style lang="scss">
    button {
        width: 93px;
    }
</style>

<script lang="ts">
    import SveltyPicker from 'svelty-picker'

    import { Button } from '@ui'

    import { localize } from '@core/i18n'

    import { closeDrawer, DrawerId } from '@/auxiliary/drawer'

    export let value: Date = undefined
    export let startDate: Date = null
    export let mode: 'auto' | 'datetime' | 'date' | 'time' = 'auto'
    export let onConfirm: (value: Date) => void = () => {}

    const sveltyPickerStartDate = convertDateToSveltyPickerFormat(startDate)

    let sveltyPickerDate = convertDateToSveltyPickerFormat(value) ?? sveltyPickerStartDate

    function convertDateToSveltyPickerFormat(date: Date): string {
        return date?.toLocaleString('sv')
    }

    function onConfirmClick(): void {
        onConfirm(new Date(sveltyPickerDate))
        closeDrawer(DrawerId.DateTimePicker)
    }
</script>

<datetime-picker-drawer class="w-full h-full space-y-6 flex flex-auto flex-col items-center shrink-0">
    <SveltyPicker
        pickerOnly
        autoclose
        {mode}
        clearBtn={false}
        todayBtn={false}
        startDate={sveltyPickerStartDate}
        format="yyyy-mm-dd hh:ii"
        theme="datetime-picker-colors"
        bind:value={sveltyPickerDate}
    />
    <Button onClick={onConfirmClick} classes="w-full">{localize('actions.confirm')}</Button>
</datetime-picker-drawer>

<style lang="scss">
    :global(body.scheme-dark) {
        :global(.datetime-picker-colors) {
            --sdt-color: theme('colors.white');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-header-bg-hover: theme('colors.gray.800');
            --sdt-clock-bg: theme('colors.gray.800');
            --sdt-clock-bg-minute: theme('colors.gray.800');
        }
    }

    :global(.datetime-picker-colors) {
        --sdt-primary: theme('colors.blue.500');
        --sdt-color: theme('colors.gray.600');
        --sdt-color-selected: theme('colors.white');
        --sdt-bg-main: none;
        --sdt-bg-today: var(--sdt-primary);
        --sdt-today-color: theme('colors.white');
        --sdt-btn-bg-hover: theme('colors.gray.200');
        --sdt-btn-header-bg-hover: theme('colors.gray.200');
        --sdt-clock-bg: theme('colors.gray.200');
        --sdt-clock-bg-minute: theme('colors.gray.200');
        --sdt-clock-bg-shadow: none;
        --sdt-shadow: none;
    }
</style>

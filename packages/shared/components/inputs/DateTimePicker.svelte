<!-- this is a wrapper component for svelty-picker -->
<script lang="ts">
    import SveltyPicker from 'svelty-picker'
    import { createEventDispatcher } from 'svelte'
    import { Tooltip, Button } from 'shared/components'
    import { localize } from '@core/i18n'

    export let value: Date
    export let mode: string = 'auto'

    const dispatch = createEventDispatcher()
    const sveltyPickerStartDate = convertDateToSveltyPickerFormat(new Date())

    let sveltyPickerDate = convertDateToSveltyPickerFormat(value) ?? sveltyPickerStartDate
    let tooltip: Tooltip

    function convertDateToSveltyPickerFormat(date: Date): string {
        return date?.toLocaleString('sv')
    }

    function handleCancelClick(): void {
        dispatch('cancel')
    }

    function handleConfirmClick(): void {
        value = new Date(sveltyPickerDate)
        dispatch('confirm')
    }
</script>

<Tooltip {...$$restProps} classes="flex justify-center items-center flex-col" bind:this={tooltip}>
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
        on:change={tooltip?.refreshPosition}
    />
    <div class="flex flex-row justify-center items-center space-x-4 w-full">
        <Button small secondary onClick={handleCancelClick} classes="w-full">{localize('actions.cancel')}</Button>
        <Button small onClick={handleConfirmClick} classes="w-full">{localize('actions.confirm')}</Button>
    </div>
</Tooltip>

<style type="text/scss">
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

<script lang="ts">
    // this is a wrapper component for svelty-picker

    import { createEventDispatcher } from 'svelte'
    import SveltyPicker from 'svelty-picker'
    import { Tooltip, Button } from 'shared/components'
    import { localize } from '@core/i18n'

    export let value: Date

    const dispatch = createEventDispatcher()
    const pickedDate = value ? new Date(value).toLocaleString('sv') : undefined
    const startDate = getNowDate().toLocaleString('sv')

    let rawValue: string = pickedDate ? pickedDate : startDate
    let tooltip: Tooltip

    function getNowDate(): Date {
        return new Date(Date.now())
    }

    function handleCancelClick(): void {
        dispatch('cancel')
    }

    function handleConfirmClick(): void {
        value = new Date(rawValue)
        dispatch('confirm')
    }
</script>

<Tooltip {...$$restProps} classes="flex justify-center items-center flex-col" bind:this={tooltip}>
    <SveltyPicker
        pickerOnly
        autoclose
        clearBtn={false}
        todayBtn={false}
        {startDate}
        format="yyyy-mm-dd hh:ii"
        theme="datetime-picker-colors"
        bind:value={rawValue}
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

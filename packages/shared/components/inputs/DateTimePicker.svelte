<!-- this is a wrapper component for svelty-picker -->
<script lang="ts">
    import SveltyPicker from 'svelty-picker'
    import { createEventDispatcher } from 'svelte'
    import { Tooltip, Button, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import sveltyPickerTranslations from 'svelty-picker/i18n'
    import { appSettings } from '@core/app'

    export let value: Date = undefined
    export let startDate: Date = null
    export let mode: 'auto' | 'datetime' | 'date' | 'time' = 'auto'

    const dispatch = createEventDispatcher()
    const sveltyPickerStartDate = convertDateToSveltyPickerFormat(startDate)

    let sveltyPickerDate = convertDateToSveltyPickerFormat(value) ?? sveltyPickerStartDate
    const translations = getSveltyPickerTranslations()
    let tooltip: Tooltip

    function convertDateToSveltyPickerFormat(date: Date): string {
        return date?.toLocaleString('sv')
    }

    function onCancelClick(): void {
        dispatch('cancel')
    }

    function onConfirmClick(): void {
        value = new Date(sveltyPickerDate)
        dispatch('confirm')
    }

    function getSveltyPickerTranslations(): Record<string, unknown> {
        return sveltyPickerTranslations[getSveltyPickerLanguage($appSettings.language)] ?? sveltyPickerTranslations.en
    }

    function getSveltyPickerLanguage(settingsLanguage: string): string {
        switch (settingsLanguage) {
            case 'cs':
                return 'cz'
            case 'de':
                return 'de'
            case 'en':
                return 'en'
            case 'es-ES':
            case 'es-LA':
                return 'es'
            case 'fr':
                return 'fr'
            case 'hu':
                return 'hu'
            case 'id':
                return 'id'
            case 'ja':
                return 'jp'
            case 'ko':
                return 'ko'
            case 'nl':
                return 'nl'
            case 'pt-BR':
            case 'pt-PT':
                return 'pt_BR'
            case 'sk':
                return 'sk'
            default:
                return 'en'
        }
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
        i18n={translations}
        format="yyyy-mm-dd hh:ii"
        theme="datetime-picker-colors"
        bind:value={sveltyPickerDate}
        on:change={tooltip?.refreshPosition}
    />
    <div class="flex flex-row justify-center items-center space-x-4 w-full">
        <Button size={ButtonSize.Small} outline onClick={onCancelClick} classes="w-full"
            >{localize('actions.cancel')}</Button
        >
        <Button size={ButtonSize.Small} onClick={onConfirmClick} classes="w-full">{localize('actions.confirm')}</Button>
    </div>
</Tooltip>

<style type="text/scss">
    @media (prefers-color-scheme: dark) {
        :global(.datetime-picker-colors) {
            --sdt-color: theme('colors.white');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-header-bg-hover: theme('colors.gray.800');
            --sdt-clock-bg: theme('colors.gray.800');
            --sdt-clock-bg-minute: theme('colors.gray.800');
        }
    }

    @media (prefers-color-scheme: light) {
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
    }
</style>

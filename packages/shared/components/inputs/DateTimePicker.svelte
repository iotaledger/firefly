<!-- this is a wrapper component for svelty-picker -->
<script lang="ts">
    import SveltyPicker from 'svelty-picker'
    import sveltyPickerTranslations from 'svelty-picker/i18n'
    import { ComponentProps, createEventDispatcher } from 'svelte'
    import { Tooltip, Button, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { appSettings } from '@core/app'

    export let value: Date | null | undefined = undefined
    export let startDate: Date | null | undefined = undefined
    export let mode: 'auto' | 'datetime' | 'date' | 'time' = 'auto'

    const dispatch = createEventDispatcher()
    const sveltyPickerStartDate = convertDateToSveltyPickerFormat(startDate)
    const translations = getSveltyPickerTranslations()

    let sveltyPickerDate = convertDateToSveltyPickerFormat(value) ?? sveltyPickerStartDate
    let tooltip: Tooltip

    function convertDateToSveltyPickerFormat(date: Date | null | undefined): string | undefined {
        return date?.toLocaleString('sv', {
            dateStyle: 'short',
            timeStyle: 'short',
        })
    }

    function onCancelClick(): void {
        dispatch('cancel')
    }

    function onConfirmClick(): void {
        if (sveltyPickerDate) value = new Date(sveltyPickerDate)
        dispatch('confirm')
    }

    function getSveltyPickerTranslations(): ComponentProps<SveltyPicker>['i18n'] {
        return sveltyPickerTranslations[getSveltyPickerLanguage($appSettings.language)] ?? sveltyPickerTranslations.en
    }

    function getSveltyPickerLanguage(settingsLanguage: string): keyof typeof sveltyPickerTranslations {
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

    function onInput(e: CustomEvent) {
        if (e.detail) value = new Date(e.detail)
    }
</script>

<Tooltip {...$$restProps} classes="flex justify-center items-center flex-col" bind:this={tooltip}>
    <datetime-picker-wrapper>
        <SveltyPicker
            pickerOnly
            autocommit
            {mode}
            clearBtn={false}
            todayBtn={false}
            startDate={sveltyPickerStartDate}
            i18n={translations}
            format="yyyy-mm-dd hh:ii"
            bind:value={sveltyPickerDate}
            on:change={tooltip?.refreshPosition}
            on:input={onInput}
        >
            <div
                slot="action-row"
                let:onConfirm
                class="flex flex-row justify-center items-center space-x-4 mt-2 w-full"
            >
                <Button size={ButtonSize.Small} outline onClick={onCancelClick} classes="w-full"
                    >{localize('actions.cancel')}</Button
                >
                <Button
                    size={ButtonSize.Small}
                    onClick={() => {
                        onConfirm()
                        onConfirmClick()
                    }}
                    classes="w-full">{localize('actions.confirm')}</Button
                >
            </div>
        </SveltyPicker>
    </datetime-picker-wrapper>
</Tooltip>

<style lang="scss">
    @media (prefers-color-scheme: dark) {
        :global(datetime-picker-wrapper) {
            :global(.std-calendar-wrap) {
                --sdt-wrap-shadow: none;

                --sdt-disabled-date: theme('colors.gray.500');
                --sdt-color-selected: theme('colors.white');

                --sdt-clock-bg: theme('colors.gray.800');
                --sdt-header-color: theme('colors.white');
                --sdt-color: theme('colors.white');
                --sdt-bg-main: theme('colors.gray.900');
                --sdt-header-btn-bg-hover: theme('colors.gray.800');
                --sdt-table-selected-bg: theme('colors.blue.500');
                --sdt-table-data-bg-hover: theme('colors.gray.800');
                --sdt-clock-disabled: theme('colors.gray.600');
                --sdt-clock-disabled-bg: none;
                --sdt-clock-selected-bg: theme('colors.blue.500');
            }
        }
    }
    @media (prefers-color-scheme: light) {
        :global(datetime-picker-wrapper) {
            :global(.std-calendar-wrap) {
                --sdt-table-selected-bg: theme('colors.blue.500');
                --sdt-clock-disabled: theme('colors.gray.500');
                --sdt-clock-disabled-bg: none;
                --sdt-clock-selected-bg: theme('colors.blue.500');

                --sdt-table-data-bg-hover: theme('colors.gray.200');
                --sdt-color: theme('colors.gray.600');
                --sdt-color-selected: theme('colors.white');
                --sdt-header-color: theme('colors.gray.600');
                --sdt-bg-main: none;
                --sdt-header-btn-bg-hover: theme('colors.gray.200');
                --sdt-clock-bg: theme('colors.gray.200');
                --sdt-disabled-date: theme('colors.gray.500');
                --sdt-wrap-shadow: none;
            }
        }
    }
</style>

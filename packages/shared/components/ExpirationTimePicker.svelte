<script lang="ts">
    import { Text, Icon, Modal, MenuItem, DateTimePicker } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { formatDate, localize } from '@core/i18n'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, TimePeriod, isValidExpirationDateTime } from '@core/utils'
    import { fade } from 'svelte/transition'
    import { showAppNotification } from '@auxiliary/notification'

    export let value: Date | null = null
    export let disabled: boolean = false

    let anchor: HTMLElement | undefined = undefined
    let selectedTimePeriod: TimePeriod = TimePeriod.None
    let dateTimeSelectorValue: Date | undefined
    let showDateTimePickerModal: boolean = false
    let expirationTimePickerModal: Modal

    $: selectedTimePeriod !== TimePeriod.Custom && (value = TIME_PERIOD_TO_DATE[selectedTimePeriod])

    function getTimePeriodSubtitle(timePeriod: TimePeriod): string | undefined {
        if (timePeriod === TimePeriod.None) {
            return undefined
        } else if (timePeriod === TimePeriod.Custom) {
            if (dateTimeSelectorValue) {
                return formatDate(dateTimeSelectorValue, { dateStyle: 'medium', timeStyle: 'medium' })
            } else {
                return localize('menus.expirationTimePicker.customDate.subtitle')
            }
        } else {
            return formatDate(TIME_PERIOD_TO_DATE[timePeriod], {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })
        }
    }

    function openCustomDatePicker(): void {
        if (!showDateTimePickerModal) {
            expirationTimePickerModal?.open()
        } else {
            showDateTimePickerModal = !showDateTimePickerModal
        }
    }

    function onChooseExpirationTimeClick(_selected: TimePeriod): void {
        if (_selected === TimePeriod.Custom) {
            showDateTimePickerModal = true
        } else {
            dateTimeSelectorValue = undefined
        }
        expirationTimePickerModal?.close()
        selectedTimePeriod = _selected
    }

    function onCancelExpirationTimeClick(): void {
        if (!dateTimeSelectorValue) {
            selectedTimePeriod = TimePeriod.None
        }
        showDateTimePickerModal = false
    }

    function onConfirmExpirationTimeClick(): void {
        if (dateTimeSelectorValue && isValidExpirationDateTime(dateTimeSelectorValue)) {
            value = dateTimeSelectorValue
            showDateTimePickerModal = false
        } else {
            showAppNotification({
                type: 'warning',
                message: localize('warning.transaction.invalidExpirationDateTime'),
            })
        }
    }

    const TIME_PERIOD_TO_DATE = {
        [TimePeriod.OneHour]: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        [TimePeriod.OneDay]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        [TimePeriod.OneWeek]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        [TimePeriod.None]: null,
    }

    const MENU_ITEMS: { timePeriod: TimePeriod; title: string; separator?: boolean }[] = [
        {
            title: localize('menus.expirationTimePicker.none'),
            timePeriod: TimePeriod.None,
            separator: true,
        },
        {
            title: localize('menus.expirationTimePicker.1hour'),
            timePeriod: TimePeriod.OneHour,
        },
        {
            title: localize('menus.expirationTimePicker.1day'),
            timePeriod: TimePeriod.OneDay,
        },
        {
            title: localize('menus.expirationTimePicker.1week'),
            timePeriod: TimePeriod.OneWeek,
            separator: true,
        },
        {
            title: localize('menus.expirationTimePicker.customDate.title'),
            timePeriod: TimePeriod.Custom,
        },
    ]
</script>

<button {disabled} on:click={openCustomDatePicker} bind:this={anchor}>
    <div class="flex flex-row hover:text-blue-600">
        <Text
            highlighted={!disabled}
            color="gray-600"
            darkColor="gray-500"
            classes={disabled ? '' : 'hover:text-blue-600'}
        >
            {value ? formatDate(value, { dateStyle: 'long', timeStyle: 'medium' }) : localize('general.none')}
        </Text>
        {#if !disabled}
            <Icon icon={IconEnum.ChevronDown} width="10" classes="text-blue-500 ml-1" />
        {/if}
    </div>
</button>

<Modal bind:this={expirationTimePickerModal} position={{ bottom: '120px', left: '400px' }} size="medium">
    <expiration-time-picker-modal class="flex flex-col space-y-0 whitespace-nowrap" in:fade={{ duration: 100 }}>
        {#each MENU_ITEMS as { title, timePeriod, separator }}
            <MenuItem
                icon={IconEnum.Calendar}
                {title}
                subtitle={getTimePeriodSubtitle(timePeriod)}
                onClick={() => onChooseExpirationTimeClick(timePeriod)}
                selected={selectedTimePeriod === timePeriod}
            />
            {#if separator}
                <hr />
            {/if}
        {/each}
    </expiration-time-picker-modal>
</Modal>

{#if showDateTimePickerModal}
    <DateTimePicker
        {anchor}
        position="top"
        startDate={new Date(Date.now() + 5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)}
        bind:value={dateTimeSelectorValue}
        {...$$restProps}
        on:cancel={onCancelExpirationTimeClick}
        on:confirm={onConfirmExpirationTimeClick}
    />
{/if}

<style lang="scss">
    button {
        @apply flex items-center justify-center;
    }
</style>

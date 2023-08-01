<script lang="ts">
    import { formatDate, localize } from '@core/i18n'
    import { TimePeriod } from '@core/utils'
    import { Modal, MenuItem, ExpirationDateTimePicker } from 'shared/components'
    import { fade } from 'svelte/transition'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let value: Date | null
    export let selected: TimePeriod = TimePeriod.None
    export let anchor: HTMLElement | undefined = undefined

    export function tryOpen(): void {
        if (!canShowDateTimePicker) {
            modal?.open()
        } else {
            canShowDateTimePicker = !canShowDateTimePicker
        }
    }

    const DATE_NOW = Date.now()

    let previouslySelected: TimePeriod = selected
    let customDate: Date | null
    let canShowDateTimePicker = false
    let modal: Modal

    const dateIn1Hour = new Date(DATE_NOW)
    dateIn1Hour.setTime(dateIn1Hour.getTime() + 1 * 60 * 60 * 1000)

    const dateIn1Day = new Date(DATE_NOW)
    dateIn1Day.setDate(dateIn1Day.getDate() + 1)

    const dateIn1Week = new Date(DATE_NOW)
    dateIn1Week.setDate(dateIn1Week.getDate() + 7)

    $: {
        switch (selected) {
            case TimePeriod.OneHour:
                value = dateIn1Hour
                break
            case TimePeriod.OneDay:
                value = dateIn1Day
                break
            case TimePeriod.OneWeek:
                value = dateIn1Week
                break
            case TimePeriod.None:
                value = null
                break
            case TimePeriod.Custom:
            default:
                break
        }
    }

    function onChooseExpirationTimeClick(_selected: TimePeriod): void {
        if (_selected === TimePeriod.Custom) {
            canShowDateTimePicker = !canShowDateTimePicker
        } else {
            customDate = null
        }
        modal?.close()
        previouslySelected = selected
        selected = _selected
    }

    function onCancelExpirationTimeClick(): void {
        if (!customDate) {
            selected = previouslySelected
        }
        canShowDateTimePicker = false
    }

    function onConfirmExpirationTimeClick(): void {
        value = customDate
        canShowDateTimePicker = false
    }
</script>

<Modal bind:this={modal} position={{ bottom: '120px', left: '400px' }} size="medium">
    <expiration-time-picker-modal class="flex flex-col space-y-0 whitespace-nowrap" in:fade={{ duration: 100 }}>
        <MenuItem
            icon={IconEnum.Calendar}
            title={localize('menus.expirationTimePicker.none')}
            onClick={() => onChooseExpirationTimeClick(TimePeriod.None)}
            selected={selected === TimePeriod.None}
        />
        <hr />
        <MenuItem
            icon={IconEnum.Calendar}
            title={localize('menus.expirationTimePicker.1hour')}
            subtitle={formatDate(dateIn1Hour, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseExpirationTimeClick(TimePeriod.OneHour)}
            selected={selected === TimePeriod.OneHour}
        />
        <MenuItem
            icon={IconEnum.Calendar}
            title={localize('menus.expirationTimePicker.1day')}
            subtitle={formatDate(dateIn1Day, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseExpirationTimeClick(TimePeriod.OneDay)}
            selected={selected === TimePeriod.OneDay}
        />
        <MenuItem
            icon={IconEnum.Calendar}
            title={localize('menus.expirationTimePicker.1week')}
            subtitle={formatDate(dateIn1Week, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseExpirationTimeClick(TimePeriod.OneWeek)}
            selected={selected === TimePeriod.OneWeek}
        />
        <hr />
        <MenuItem
            icon={IconEnum.Calendar}
            title={localize('menus.expirationTimePicker.customDate.title')}
            subtitle={customDate
                ? formatDate(customDate, { dateStyle: 'medium', timeStyle: 'medium' })
                : localize('menus.expirationTimePicker.customDate.subtitle')}
            onClick={() => onChooseExpirationTimeClick(TimePeriod.Custom)}
            selected={selected === TimePeriod.Custom}
        />
    </expiration-time-picker-modal>
</Modal>
{#if canShowDateTimePicker}
    <ExpirationDateTimePicker
        position="top"
        {anchor}
        bind:value={customDate}
        on:cancel={onCancelExpirationTimeClick}
        on:confirm={onConfirmExpirationTimeClick}
    />
{/if}

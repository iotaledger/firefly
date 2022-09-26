<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { ExpirationTime } from '@core/utils'
    import { HR, Modal, MenuItem, ExpirationDateTimePicker } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let value: Date
    export let selected: ExpirationTime = ExpirationTime.None
    export let anchor: HTMLElement

    export function tryOpen(): void {
        if (!canShowDateTimePicker) {
            modal?.open()
        } else {
            canShowDateTimePicker = !canShowDateTimePicker
        }
    }

    const DATE_NOW = Date.now()

    let previouslySelected: ExpirationTime = selected
    let customDate: Date
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
            case ExpirationTime.OneHour:
                value = dateIn1Hour
                break
            case ExpirationTime.OneDay:
                value = dateIn1Day
                break
            case ExpirationTime.OneWeek:
                value = dateIn1Week
                break
            case ExpirationTime.None:
                value = null
                break
            case ExpirationTime.Custom:
            default:
                break
        }
    }

    function handleChooseExpirationTimeClick(_selected: ExpirationTime): void {
        if (_selected === ExpirationTime.Custom) {
            canShowDateTimePicker = !canShowDateTimePicker
        } else {
            customDate = undefined
        }
        modal?.close()
        previouslySelected = selected
        selected = _selected
    }

    function handleExpirationTimeCancelClick(): void {
        if (!customDate) {
            selected = previouslySelected
        }
        canShowDateTimePicker = false
    }

    function handleExpirationTimeConfirmClick(): void {
        value = customDate
        canShowDateTimePicker = false
    }
</script>

<Modal bind:this={modal} position={{ bottom: '120px', left: '400px' }} size="medium">
    <expiration-time-picker-modal class="flex flex-col space-y-0 whitespace-nowrap" in:fade={{ duration: 100 }}>
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.none')}
            onClick={() => handleChooseExpirationTimeClick(ExpirationTime.None)}
            selected={selected === ExpirationTime.None}
        />
        <HR />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1hour')}
            subtitle={formatDate(dateIn1Hour, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneHour)}
            selected={selected === ExpirationTime.OneHour}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1day')}
            subtitle={formatDate(dateIn1Day, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneDay)}
            selected={selected === ExpirationTime.OneDay}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1week')}
            subtitle={formatDate(dateIn1Week, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick(ExpirationTime.OneWeek)}
            selected={selected === ExpirationTime.OneWeek}
        />
        <HR />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.customDate.title')}
            subtitle={customDate
                ? formatDate(customDate, { dateStyle: 'long', timeStyle: 'medium' })
                : localize('menus.expirationTimePicker.customDate.subtitle')}
            onClick={() => handleChooseExpirationTimeClick(ExpirationTime.Custom)}
            selected={selected === ExpirationTime.Custom}
        />
    </expiration-time-picker-modal>
</Modal>
{#if canShowDateTimePicker}
    <ExpirationDateTimePicker
        position="top"
        {anchor}
        bind:value={customDate}
        on:cancel={handleExpirationTimeCancelClick}
        on:confirm={handleExpirationTimeConfirmClick}
    />
{/if}

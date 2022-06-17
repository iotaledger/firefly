<script lang="typescript" context="module">
    export type ExpirationTimeSelection = 'none' | '1hour' | '1day' | '1week' | 'custom'
</script>

<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { HR, Modal, MenuItem, ExpirationDateTimePicker } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let value: Date
    export let selected: ExpirationTimeSelection = 'none'
    export let anchor: HTMLElement

    export function tryOpen(): void {
        if (!canShowDateTimePicker) {
            modal?.open()
        } else {
            canShowDateTimePicker = !canShowDateTimePicker
        }
    }

    const DATE_NOW = Date.now()

    let previouslySelected: ExpirationTimeSelection = selected
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
            case 'none':
                value = null
                break
            case '1hour':
                value = dateIn1Hour
                break
            case '1day':
                value = dateIn1Day
                break
            case '1week':
                value = dateIn1Week
                break
            case 'custom':
                break
            default:
                value = null
        }
    }

    function handleChooseExpirationTimeClick(_selected: ExpirationTimeSelection): void {
        if (_selected === 'custom') {
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

<Modal bind:this={modal} position={{ bottom: '120px', left: '400px' }} classes="w-64">
    <expiration-time-picker-modal class="flex flex-col space-y-0" in:fade={{ duration: 100 }}>
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.none')}
            onClick={() => handleChooseExpirationTimeClick('none')}
            first
            last
            selected={selected === 'none'}
        />
        <HR />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1hour')}
            subtitle={formatDate(dateIn1Hour, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick('1hour')}
            first
            selected={selected === '1hour'}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1day')}
            subtitle={formatDate(dateIn1Day, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick('1day')}
            selected={selected === '1day'}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1week')}
            subtitle={formatDate(dateIn1Week, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => handleChooseExpirationTimeClick('1week')}
            last
            selected={selected === '1week'}
        />
        <HR />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.customDate.title')}
            subtitle={customDate
                ? formatDate(customDate, { dateStyle: 'long', timeStyle: 'medium' })
                : localize('menus.expirationTimePicker.customDate.subtitle')}
            onClick={() => handleChooseExpirationTimeClick('custom')}
            first
            last
            selected={selected === 'custom'}
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

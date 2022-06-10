<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { HR, Modal, MenuItem, DateTimePicker } from 'shared/components'
    import { fade } from 'svelte/transition'

    export let modal: Modal
    export let value: string
    export let selected: 'none' | '1hour' | '1day' | '1week' | 'custom' = 'none'
    export let expireDate: Date

    const DATE_NOW = Date.now()

    let customDate: Date
    let dateTimeAnchor: HTMLElement
    let canShowDateTimePicker = false

    const dateIn1Hour = new Date(DATE_NOW)
    dateIn1Hour.setTime(dateIn1Hour.getTime() + 1 * 60 * 60 * 1000)

    const dateIn1Day = new Date(DATE_NOW)
    dateIn1Day.setDate(dateIn1Day.getDate() + 1)

    const dateIn1Week = new Date(DATE_NOW)
    dateIn1Week.setDate(dateIn1Week.getDate() + 7)

    $: {
        switch (selected) {
            case 'none':
                value = 'None'
                break
            case '1hour':
                value = formatDate(dateIn1Hour, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
                expireDate = dateIn1Hour
                break
            case '1day':
                value = formatDate(dateIn1Day, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
                expireDate = dateIn1Day
                break
            case '1week':
                value = formatDate(dateIn1Week, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
                expireDate = dateIn1Week
                break
            case 'custom':
                value = formatDate(customDate, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
                expireDate = customDate
                break
            default:
                value = 'None'
        }
    }

    function onClick(_selected): void {
        if (_selected === 'custom') {
            canShowDateTimePicker = !canShowDateTimePicker
        } else {
            modal?.close()
        }
        selected = _selected
    }
</script>

<Modal
    bind:this={modal}
    position={{ bottom: '120px', left: '400px' }}
    classes="w-64"
    on:close={() => (canShowDateTimePicker = false)}
>
    <expiration-time-picker-modal class="flex flex-col space-y-0" in:fade={{ duration: 100 }}>
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.none')}
            onClick={() => onClick('none')}
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
            onClick={() => onClick('1hour')}
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
            onClick={() => onClick('1day')}
            selected={selected === '1day'}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.expirationTimePicker.1week')}
            subtitle={formatDate(dateIn1Week, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })}
            onClick={() => onClick('1week')}
            last
            selected={selected === '1week'}
        />
        <HR />
        <div bind:this={dateTimeAnchor}>
            <MenuItem
                icon="calendar"
                title={localize('menus.expirationTimePicker.customDate.title')}
                subtitle={customDate
                    ? formatDate(customDate, { dateStyle: 'long', timeStyle: 'medium' })
                    : localize('menus.expirationTimePicker.customDate.subtitle')}
                onClick={() => onClick('custom')}
                first
                last
                selected={selected === 'custom'}
            />
        </div>
        {#if canShowDateTimePicker}
            <DateTimePicker
                position="top"
                anchor={dateTimeAnchor}
                bind:value={customDate}
                on:cancel={() => (canShowDateTimePicker = false)}
                on:confirm={modal?.close}
            />
        {/if}
    </expiration-time-picker-modal>
</Modal>

<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { DateTimePicker } from 'shared/components'
    import { localize } from '@core/i18n'
    import { isValidExpirationDateTime } from '@core/utils'
    import { showAppNotification } from '@lib/notifications'

    export let value: Date

    const dispatch = createEventDispatcher()

    let rawValue: string = value?.toLocaleString()

    function handleCancelClick(): void {
        dispatch('cancel')
    }

    function handleConfirmClick(): void {
        const pickedDate = new Date(rawValue)
        if (isValidExpirationDateTime(pickedDate)) {
            value = pickedDate
            dispatch('confirm')
        } else {
            showAppNotification({
                type: 'warning',
                message: localize('warning.transaction.invalidExpirationDateTime'),
            })
        }
    }
</script>

<DateTimePicker {...$$restProps} bind:value={rawValue} on:cancel={handleCancelClick} on:confirm={handleConfirmClick} />

<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { DateTimePicker } from 'shared/components'
    import { localize } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'

    export let value: Date

    const dispatch = createEventDispatcher()

    let rawValue: string = value?.toLocaleString()

    function handleCancelClick(): void {
        dispatch('cancel')
    }

    function handleConfirmClick(): void {
        const nowDate = new Date(Date.now())
        const pickedDate = new Date(rawValue)

        const isValidExpirationTime = pickedDate.getTime() >= nowDate.getTime()
        if (isValidExpirationTime) {
            value = pickedDate
            dispatch('confirm')
        } else {
            showAppNotification({
                type: 'warning',
                message: localize('warning.transaction.invalidExpirationTime'),
            })
        }
    }
</script>

<DateTimePicker {...$$restProps} bind:value={rawValue} on:cancel={handleCancelClick} on:confirm={handleConfirmClick} />

<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { DateTimePicker } from 'shared/components'
    import { localize } from '@core/i18n'
    import { isValidExpirationDateTime, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
    import { showAppNotification } from '@auxiliary/notification'

    export let value: Date = new Date(Date.now() + 5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)

    const dispatch = createEventDispatcher()

    function handleCancelClick(): void {
        dispatch('cancel')
    }

    function handleConfirmClick(): void {
        if (isValidExpirationDateTime(value)) {
            dispatch('confirm')
        } else {
            showAppNotification({
                type: 'warning',
                message: localize('warning.transaction.invalidExpirationDateTime'),
            })
        }
    }
</script>

<DateTimePicker
    {...$$restProps}
    bind:value
    on:cancel={handleCancelClick}
    on:confirm={handleConfirmClick}
    startTime={new Date()}
/>

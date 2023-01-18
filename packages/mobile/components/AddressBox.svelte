<script lang="typescript">
    import { removeDisplayNotification, showAppNotification } from '@auxiliary/notification'
    import { localize } from '@core/i18n'
    import { setClipboard } from '@core/utils'
    import { Box, FontWeight, Text, TextType } from 'shared/components'

    export let address = ''
    export let fontSize = 'base'

    let notificationId

    export function copyAddress(): void {
        setClipboard(address, false)
        removeDisplayNotification(notificationId)
        notificationId = showAppNotification({
            type: 'info',
            message: localize('general.copiedToClipboard'),
        })
    }
</script>

{#if address}
    <button on:click={copyAddress}>
        <Box clearPadding col {...$$restProps}>
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(0, address.length / 2)}
            </Text>
            <Text type={TextType.pre} {fontSize} fontWeight={FontWeight.medium}>
                {address.slice(address.length / 2)}
            </Text>
        </Box>
    </button>
{/if}

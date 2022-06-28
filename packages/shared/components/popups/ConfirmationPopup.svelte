<script lang="typescript">
    import { Button, Text, Icon } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'

    export let title: string
    export let description: string
    export let node: string
    export let warning: boolean
    export let onConfirm: () => void = undefined
    export let onCancel: () => void = undefined

    function confirmClick(): void {
        onConfirm()
    }

    function cancelClick(): void {
        if (onCancel) {
            onCancel()
        } else {
            closePopup()
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left">
        {title}
    </Text>
    <Text fontSize="text-14" classes="text-left">{description}</Text>
    {#if node}
        <div class="flex flex-row items-center bg-blue-50 p-4">
            <Icon height="18" width="18" icon="info" classes="text-gray-500 dark:text-white mr-4" />
            <Text fontSize="text-13" classes="text-left">{node}</Text>
        </div>
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={cancelClick}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" {warning} onClick={confirmClick}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</div>

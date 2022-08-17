<script lang="typescript">
    import { Button, Text, TextHint } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'

    export let title: string
    export let description: string
    export let hint: string
    export let info: boolean
    export let success: boolean
    export let warning: boolean
    export let danger: boolean
    export let confirmText: string
    export let onConfirm: () => void = undefined
    export let onCancel: () => void = undefined

    function confirmClick(): void {
        if (onConfirm) {
            onConfirm()
        } else {
            closePopup()
        }
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
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {title}
    </Text>
    <div class="space-y-4">
        {#if description}
            <Text fontSize="14" classes="text-left">{description}</Text>
        {/if}
        {#if hint}
            <TextHint {info} {success} {warning} {danger} text={hint} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={cancelClick}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" warning={warning || danger} onClick={confirmClick}
            >{confirmText ? confirmText : localize('actions.confirm')}</Button
        >
    </popup-buttons>
</div>

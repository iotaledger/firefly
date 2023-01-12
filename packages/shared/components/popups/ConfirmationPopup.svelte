<script lang="typescript">
    import { Button, Text, TextHint, TextInput, FontWeight, TextType, ButtonVariant } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'

    export let title: string
    export let description: string = ''
    export let inputCheckLabel: string = ''
    export let inputCheckValidation: string = ''
    export let hint: string = ''
    export let info: boolean = false
    export let success: boolean = false
    export let warning: boolean = false
    export let danger: boolean = false
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => void = undefined
    export let onCancel: () => void = undefined

    let value: string = ''
    let isBusy: boolean = false

    $: confirmationEnabled = !inputCheckLabel || !inputCheckValidation || value === inputCheckValidation

    function confirmClick(): void {
        if (onConfirm) {
            isBusy = true
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
            <Text fontSize="14" classes="text-left break-words">{description}</Text>
        {/if}
        {#if inputCheckLabel && inputCheckValidation}
            <TextInput bind:value label={inputCheckLabel} placeholder={inputCheckLabel} fontSize="sm" />
        {/if}
        {#if hint}
            <TextHint {info} {success} {warning} {danger} text={hint} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={cancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            variant={warning || danger ? ButtonVariant.Warning : ButtonVariant.Primary}
            onClick={confirmClick}
            disabled={!confirmationEnabled}
            {isBusy}
        >
            {confirmText}
        </Button>
    </popup-buttons>
</div>

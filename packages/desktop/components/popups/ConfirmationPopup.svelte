<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account'

    export let title: string
    export let description: string = ''
    export let hint: string = ''
    export let info: boolean = false
    export let success: boolean = false
    export let warning: boolean = false
    export let danger: boolean = false
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => void = undefined
    export let onCancel: () => void = undefined
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    function onConfirmClick(): void {
        if (onConfirm) {
            onConfirm()
        } else {
            closePopup()
        }
    }

    function onCancelClick(): void {
        if (onCancel) {
            onCancel()
        } else {
            closePopup()
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {title}
    </Text>
    <div class="space-y-4">
        {#if description}
            <Text fontSize="14" classes="text-left break-words">{description}</Text>
        {/if}
        {#if hint}
            <TextHint {info} {success} {warning} {danger} text={hint} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            variant={warning || danger ? ButtonVariant.Warning : ButtonVariant.Primary}
            disabled={$selectedAccount.isTransferring}
            isBusy={$selectedAccount.isTransferring}
            onClick={onConfirmClick}
        >
            {confirmText}
        </Button>
    </popup-buttons>
</div>

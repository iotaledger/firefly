<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedWallet } from '@core/wallet'
    import { TextHintVariant } from 'shared/components/enums'

    export let title: string
    export let description: string = ''
    export let hint: string = ''
    export let variant: TextHintVariant | undefined = undefined
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => Promise<void> = undefined
    export let onCancel: () => void = undefined
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let isBusy = false
    $: buttonVariant = [TextHintVariant.Warning, TextHintVariant.Danger].includes(variant)
        ? ButtonVariant.Warning
        : ButtonVariant.Primary

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        if (onConfirm) {
            await onConfirm()
        } else {
            closePopup()
        }
        isBusy = false
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
            <TextHint {variant} text={hint} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            variant={buttonVariant}
            disabled={$selectedWallet.isTransferring || isBusy}
            isBusy={$selectedWallet.isTransferring || isBusy}
            onClick={onConfirmClick}
        >
            {confirmText}
        </Button>
    </popup-buttons>
</div>

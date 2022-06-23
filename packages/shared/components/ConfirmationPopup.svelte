<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { localize } from '@core/i18n'
    import { closeConfirmationPopup, confirmationPopup } from '@core/app/stores/confirmation-popup'

    $: $confirmationPopup

    function onConfirm(): void {
        $confirmationPopup.callback()
        closeConfirmationPopup()
    }
</script>

{#if $confirmationPopup.open}
    <confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
        <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left">
            {$confirmationPopup.title}
        </Text>
        <Text classes="text-left">{$confirmationPopup.description}</Text>
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button classes="w-full" secondary onClick={closeConfirmationPopup}>{localize('actions.back')}</Button>
            <Button autofocus classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
        </popup-buttons>
    </confirmation-popup>
{/if}

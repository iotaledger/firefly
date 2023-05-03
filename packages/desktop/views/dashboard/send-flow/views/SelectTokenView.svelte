<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { sendFlowRouter } from '../send-flow.router'

    function onContinueClick(): void {
        $sendFlowRouter.next()
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<select-token-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <select-token-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">Select Token Title</Text>
    </select-token-title>
    <select-token-content> Select Token Content </select-token-content>
    <select-token-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </select-token-buttons>
</select-token-view>

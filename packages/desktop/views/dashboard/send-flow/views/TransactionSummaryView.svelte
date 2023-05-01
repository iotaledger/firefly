<script lang="ts">
    import { closePopup } from '@auxiliary/popup/actions'
    import { localize } from '@core/i18n'
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { sendFlowRouter } from '../send-flow-router'

    function onContinueClick(): void {
        closePopup()
    }

    function onBackClick(): void {
        $sendFlowRouter.previous()
    }
</script>

<transaction-summary-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <transaction-summary-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">Transaction Summary Title</Text>
    </transaction-summary-title>
    <transaction-summary-content> Transaction Summary Content </transaction-summary-content>
    <transaction-summary-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </transaction-summary-buttons>
</transaction-summary-view>

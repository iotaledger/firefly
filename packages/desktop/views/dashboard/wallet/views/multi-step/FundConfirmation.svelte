<script lang="ts">
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'

    // TODO: Replace this with proper time remaining
    const DUMMY_TIME_REMAINING = '5min 32s remaining'
    // TODO: Replace this with proper amount
    const DUMMY_AMOUNT = '5$'
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-40 pb-10">
    <div class="flex flex-col text-center px-4 space-y-2 max-w-md">
        <div class="flex items-center justify-center mb-7">
            <img
                src="assets/illustrations/implicit-account-creation/step2.svg"
                alt={localize('views.implicit-account-creation.steps.step2.title')}
            />
        </div>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold}
            >{localize('views.implicit-account-creation.steps.step2.view.title')} ({DUMMY_AMOUNT})</Text
        >
        <Text type={TextType.h5} fontSize="15" color="blue-700" darkColor="blue-700" fontWeight={FontWeight.semibold}
            >{localize('views.implicit-account-creation.steps.step2.view.subtitle')}</Text
        >
        <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400"
            >{DUMMY_TIME_REMAINING}</Text
        >
    </div>
    <Button disabled>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
</step-content>

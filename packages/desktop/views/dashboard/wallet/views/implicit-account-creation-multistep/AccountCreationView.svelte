<script lang="ts">
    import { Button, FontWeight, PasswordInput, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { showAppNotification } from '@auxiliary/notification'

    let error = ''
    let strongholdPassword = ''
    $: strongholdPassword, (error = '')

    function unlockWalletAndCreateAccount(): void {
        // TODO: add logic to active account
        showAppNotification({
            type: 'error',
            alert: true,
            message: localize('error.global.generic'),
        })
    }
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-28 w-full">
    <div class="flex flex-col text-center justify-center px-4 space-y-9 max-w-md w-full">
        <div class="flex items-center justify-center">
            <img
                src="assets/illustrations/implicit-account-creation/step3.svg"
                alt={localize('views.implicit-account-creation.steps.step3.title')}
            />
        </div>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold}
            >{localize('views.implicit-account-creation.steps.step3.view.title')}</Text
        >
        <PasswordInput
            {error}
            bind:value={strongholdPassword}
            autofocus
            submitHandler={activeAccount}
            placeholder={localize('views.implicit-account-creation.steps.step3.view.placeholder')}
        />
    </div>
    <Button onClick={activeAccount}>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
</step-content>

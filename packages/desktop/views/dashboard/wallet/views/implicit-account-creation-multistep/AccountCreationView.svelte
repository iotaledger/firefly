<script lang="ts">
    import { Button, FontWeight, PasswordInput, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet'
    import { unlockStronghold } from '@core/profile'

    let error = ''
    let isBusy = false
    let strongholdPassword = ''

    async function unlockWalletAndCreateAccount(): Promise<void> {
        isBusy = true
        error = ''
        try {
            if (!strongholdPassword || $selectedWallet?.implicitAccountOutputs.length === 0) return

            await unlockStronghold(strongholdPassword)
            const outputId = $selectedWallet?.implicitAccountOutputs[0].outputId
            await $selectedWallet?.implicitAccountTransition(outputId)
        } catch (err) {
            console.error('err', err)
            error = localize(err?.message ?? err)
            isBusy = false
        }
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
            bind:error
            bind:value={strongholdPassword}
            autofocus
            submitHandler={unlockWalletAndCreateAccount}
            placeholder={localize('views.implicit-account-creation.steps.step3.view.placeholder')}
        />
    </div>
    <Button
        onClick={unlockWalletAndCreateAccount}
        disabled={!strongholdPassword || strongholdPassword.length === 0 || isBusy}
        {isBusy}>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button
    >
</step-content>

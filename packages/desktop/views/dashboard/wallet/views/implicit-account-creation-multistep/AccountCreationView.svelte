<script lang="ts">
    import { Button, FontWeight, PasswordInput, Text, TextType, LedgerAnimation } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedWallet, selectedWalletId } from '@core/wallet'
    import { isSoftwareProfile, unlockStronghold, updateActiveWallet } from '@core/profile'
    import { Icon } from '@auxiliary/icon'
    import { LedgerAppName, ledgerAppName } from '@core/ledger'
    import { IllustrationEnum } from '@auxiliary/illustration'

    let error = ''
    let isBusy = false
    let strongholdPassword = ''
    $: validStronghold = $isSoftwareProfile ? strongholdPassword && strongholdPassword.length === 0 : true
    $: disabledActive = !validStronghold || isBusy
    $: iconNetwork = $ledgerAppName === LedgerAppName.Shimmer ? Icon.Shimmer : Icon.Iota

    async function unlockWalletAndCreateAccount(): Promise<void> {
        isBusy = true
        error = ''
        try {
            if ($selectedWallet?.implicitAccountOutputs.length === 0) return

            if ($isSoftwareProfile) {
                if (!strongholdPassword) return
                await unlockStronghold(strongholdPassword)
            }

            const outputId = $selectedWallet?.implicitAccountOutputs[0].outputId

            updateActiveWallet($selectedWalletId, {
                hasImplicitAccountCreationTransactionInProgress: true,
                isTransferring: true,
            })
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
        HEAD
        {#if $isSoftwareProfile}
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}
                >{localize('views.implicit-account-creation.steps.step3.view.title')}</Text
            >
            <PasswordInput
                bind:error
                bind:value={strongholdPassword}
                autofocus
                submitHandler={unlockWalletAndCreateAccount}
                placeholder={localize('views.implicit-account-creation.steps.step3.view.placeholder')}
                disabled={$selectedWallet?.hasImplicitAccountCreationTransactionInProgress}
            />
        {:else}
            <LedgerAnimation illustration={IllustrationEnum.LedgerConnected2Desktop} {iconNetwork} />
        {/if}
    </div>
    <Button
        onClick={unlockWalletAndCreateAccount}
        disabled={!strongholdPassword || strongholdPassword.length === 0 || isBusy}
        isBusy={$selectedWallet?.hasImplicitAccountCreationTransactionInProgress}
        >{localize('views.implicit-account-creation.steps.step2.view.action')}</Button
    >
</step-content>

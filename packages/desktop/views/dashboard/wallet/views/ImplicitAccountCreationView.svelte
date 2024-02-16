<script lang="ts">
    import { implicitAccountCreationRoute, ImplicitAccountCreationRoute } from '../index'
    import { InitView, AccountCreationView, FundConfirmationView, OneTimeDepositView } from '.'
    import { Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet'

    export let outputId: string | undefined
    const IMPLICIT_ACCOUNT_STEPS = Object.keys(ImplicitAccountCreationRoute).slice(1)

    // TODO: Update this when we have enough mana to route to the next step
    $: {
        if ($selectedWallet?.implicitAccountOutputs?.length > 0) {
            $implicitAccountCreationRoute = ImplicitAccountCreationRoute.FundConfirmation
        }
        if ($selectedWallet?.hasImplicitAccountCreationTransactionInProgress && $selectedWallet?.isTransferring) {
            $implicitAccountCreationRoute = ImplicitAccountCreationRoute.AccountCreation
        }
    }
</script>

<implicit-account-creation-view class="h-full">
    <box-content class="flex flex-col w-full h-full pt-9 px-8 pb-12 items-center justify-between rounded-2xl">
        <Text type={TextType.h2}>{localize('views.implicit-account-creation.title')}</Text>
        {#if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.Init}
            <InitView />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.OneTimeDeposit}
            <OneTimeDepositView />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.FundConfirmation}
            <FundConfirmationView {outputId} />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.AccountCreation}
            <AccountCreationView {outputId} />
        {/if}
    </box-content>
    {#if $implicitAccountCreationRoute !== ImplicitAccountCreationRoute.Init}
        <div class="flex flex-row justify-center space-x-2.5">
            {#each IMPLICIT_ACCOUNT_STEPS as step}
                <div
                    class="w-2.5 h-2.5 rounded-full {step === $implicitAccountCreationRoute
                        ? 'bg-blue-500'
                        : 'bg-blue-200'}"
                />
            {/each}
        </div>
    {/if}
</implicit-account-creation-view>

<style lang="scss">
    box-content {
        box-shadow: 0px 1px 4px 0px rgba(23, 27, 37, 0.04);
    }
</style>

<script lang="ts">
    import {
        DashboardRoute,
        dashboardRouter,
        implicitAccountCreationRoute,
        ImplicitAccountCreationRoute,
    } from '@core/router'
    import { InitView, AccountCreationView, FundConfirmationView, OneTimeDepositView } from '.'
    import { Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet'
    import { showAppNotification } from '@auxiliary/notification'
    import { addToVisitedTabs } from '@contexts/dashboard/stores'

    export let outputId: string | undefined
    export let isWizard: boolean = false
    const IMPLICIT_ACCOUNT_STEPS = Object.keys(ImplicitAccountCreationRoute).slice(1)

    function handleMultipleAccounts() {
        showAppNotification({
            type: 'info',
            message: localize('views.accountManagement.notification'),
            timeout: 10000,
            alert: true,
        })
        addToVisitedTabs(DashboardRoute.AccountManagement)
        $dashboardRouter.goTo(DashboardRoute.AccountManagement)
    }

    $: {
        if (isWizard) {
            if ($selectedWallet?.implicitAccountOutputs?.length === 1) {
                if ($selectedWallet?.hasEnoughManaToCreateExplicitAccount?.[outputId]) {
                    $implicitAccountCreationRoute = ImplicitAccountCreationRoute.AccountCreation
                } else {
                    $implicitAccountCreationRoute = ImplicitAccountCreationRoute.FundConfirmation
                }
            } else if ($selectedWallet?.implicitAccountOutputs?.length >= 2) {
                handleMultipleAccounts()
            } else if (
                $selectedWallet?.implicitAccountOutputs?.length === 0 &&
                !$selectedWallet?.isImplicitAccountCreationStarted
            ) {
                $implicitAccountCreationRoute = ImplicitAccountCreationRoute.Init
            }
        } else {
            if ($selectedWallet?.hasEnoughManaToCreateExplicitAccount?.[outputId]) {
                $implicitAccountCreationRoute = ImplicitAccountCreationRoute.AccountCreation
            } else {
                $implicitAccountCreationRoute = ImplicitAccountCreationRoute.FundConfirmation
            }
        }

        if ($selectedWallet?.hasImplicitAccountCreationTransactionInProgress && $selectedWallet?.isTransferring) {
            $implicitAccountCreationRoute = ImplicitAccountCreationRoute.AccountCreation
        }
    }
</script>

<implicit-account-creation-view class="h-full w-full">
    <box-content class="flex flex-col w-full h-full pt-9 pb-12 items-center justify-between rounded-2xl">
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
    {#if $implicitAccountCreationRoute !== ImplicitAccountCreationRoute.Init && !outputId}
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

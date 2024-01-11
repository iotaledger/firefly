<script lang="ts">
    import { implicitAccountCreationRoute, ImplicitAccountCreationRoute } from '../index'
    import { InitView, AccountCreation, FundConfirmation, OneTimeDeposit } from '.'
    import { Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
</script>

<implicit-account-creation-view class="flex flex-col w-full h-full pt-5 px-60 pb-12 items-center justify-between">
    <box-content class="flex flex-col w-full h-full pt-9 px-8 pb-12 items-center justify-between rounded-2xl">
        <Text type={TextType.h2}>{localize('views.implicit-account-creation.title')}</Text>
        {#if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.Init}
            <InitView />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.OneTimeDeposit}
            <OneTimeDeposit />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.FundConfirmation}
            <FundConfirmation />
        {:else if $implicitAccountCreationRoute === ImplicitAccountCreationRoute.AccountCreation}
            <AccountCreation />
        {/if}
    </box-content>
</implicit-account-creation-view>

<style lang="scss">
    box-content {
        box-shadow: 0px 1px 4px 0px rgba(23, 27, 37, 0.04);
    }
</style>

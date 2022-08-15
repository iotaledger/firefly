<script lang="typescript">
    import { Animation, Button, OnboardingLayout, RewardClaimList, Text } from 'shared/components'
    import { IAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { shimmerClaimingRouter } from '@core/router'
    import { AccountMeta } from '@iota/wallet/out/types'

    const accounts: IAccount[] = [
        <IAccount>{
            meta: <AccountMeta>{
                index: 0,
                coinType: 4219,
                alias: 'A',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 1,
                coinType: 4219,
                alias: 'B',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'C',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'D',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'E',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'F',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'G',
            },
        },
        <IAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'H',
            },
        },
    ]

    function handleBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    function handleUseBalanceFinderClick(): void {}

    function handleClaimRewardsClick(): void {
        $shimmerClaimingRouter.next()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">
            {localize('views.claimRewards.title')}
        </Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col">
        <Text type="p" secondary classes="mb-5">
            {localize('views.claimRewards.body')}
        </Text>
        <RewardClaimList {accounts} />
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full mb-5" secondary onClick={handleUseBalanceFinderClick}
            >{localize('actions.useBalanceFinder')}</Button
        >
        <Button classes="w-full" onClick={handleClaimRewardsClick}>{localize('actions.claimRewards')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>

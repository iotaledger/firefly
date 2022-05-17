<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, RewardClaimList, Text } from 'shared/components'
    import { IAccount } from '@core/account'
    import { getAccounts } from '@core/profile-manager'
    import { AccountMeta } from '@iota/wallet/out/types'

    let wallets: IAccount[] = [
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

    function handleBackClick(): void {}

    function handleUseBalanceFinderClick(): void {}

    function handleClaimRewardsClick(): void {}

    onMount(() => {
        getAccounts()
            .then((_wallets) => {
                if (_wallets?.length > 0) {
                    wallets = _wallets
                }
            })
            .catch((err) => {
                console.error(err)
            })
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">Your Shimmer staking rewards</Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col">
        <Text type="p" secondary classes="mb-5">
            Please check that your Shimmer staking rewards are correct. If not, please use the balance finder.
        </Text>
        <RewardClaimList {wallets} />
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full mb-5" secondary onClick={handleUseBalanceFinderClick}>Use balance finder</Button>
        <Button classes="w-full" onClick={handleClaimRewardsClick}>Claim rewards</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>

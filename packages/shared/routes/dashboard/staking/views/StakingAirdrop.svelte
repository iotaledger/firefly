<script lang="typescript">
    import { HR, Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { Locale } from 'shared/lib/typings/i18n'
    import { STAKING_AIRDROP_TOKENS } from '../../../../lib/participation'
    import { StakingAirdrop } from '../../../../lib/typings/participation'

    import { 
        assemblyStakingRemainingDays,
        shimmerStakingRemainingDays, 
        assemblyRewards,
        shimmerRewards 
    } from 'shared/lib/participation'

    export let locale: Locale
    export let airdrop: StakingAirdrop

    const isAssembly = (): boolean => airdrop === StakingAirdrop.Assembly
    const isShimmer = (): boolean => airdrop === StakingAirdrop.Shimmer

    const handleLearnMoreClick = (): void => {
        Electron.openUrl(getLearnMoreUrl())
    }

    const getLearnMoreUrl = (): string => {
        switch(airdrop) {
            case StakingAirdrop.Assembly:
                return 'https://shimmer.network'
            case StakingAirdrop.Shimmer:
                return 'https://shimmer.network'
            default:
                return ''
        }
    }
</script>

<div class="flex flex-col space-y-12 w-full h-full bg-{airdrop}-bg">
    <div class="h-4/12">
        <Illustration illustration="{airdrop}-airdrop-bg" />
    </div>
    <div class="h-2/12"></div>
    <div class="px-8 h-6/12">
        <Text type="h5" classes="mb-6 text-2xl text-{isAssembly() ? 'black' : 'white'}">
            {locale(`views.staking.airdrops.${airdrop}.name`)}
        </Text>
        <Text type="p" classes="mb-3 text-{isAssembly() ? 'black' : 'white'}">
            {locale(`views.staking.airdrops.${airdrop}.description`)}
        </Text>
        <Link onClick={handleLearnMoreClick} classes="text-{airdrop}-highlight">
            {locale('actions.learnMore')} >
        </Link>
        <HR classes="my-6" />
        <div class="flex flex-row space-x-2">
            <div class="flex flex-col w-1/2">
                <div>
                    <Text type="p" classes="font-bold text-2xl inline text-{isAssembly() ? 'black' : 'white'}">{isAssembly() ? `${$assemblyStakingRemainingDays} days` : `${$shimmerStakingRemainingDays} days`}</Text>
                    <Text type="p" secondary classes="text-lg inline">{locale('general.days')}</Text>
                </div>
                <Text type="p" secondary>{locale('views.staking.airdrops.remaining')}</Text>
            </div>
            <div class="flex flex-col w-1/2">
                <div>
                    <Text type="p" classes="font-bold text-2xl inline text-{isAssembly() ? 'black' : 'white'}">{isAssembly() ? $assemblyRewards : $shimmerRewards}</Text>
                    <Text type="p" secondary classes="text-lg inline">{STAKING_AIRDROP_TOKENS[airdrop]}</Text>
                </div>
                <Text type="p" secondary>{locale('views.staking.airdrops.collectedRewards')}</Text>
            </div>
        </div>
    </div>
</div>

<script lang="typescript">
    import { HR, Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    enum Airdrop {
        Assembly = 'assembly',
        Shimmer = 'shimmer',
    }
    enum AirdropToken {
        [Airdrop.Assembly] = 'ASM',
        [Airdrop.Shimmer] = 'SHM',
    }
    export let airdrop: Airdrop

    const isAssembly = (): boolean => airdrop === Airdrop.Assembly
    const isShimmer = (): boolean => airdrop === Airdrop.Shimmer

    const handleLearnMoreClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }

    const getLearnMoreUrl = (): string => {
        switch(airdrop) {
            case Airdrop.Assembly:
                return 'https://shimmer-website-balvarez-iota1.vercel.app/'
            case Airdrop.Shimmer:
                return 'https://shimmer-website-balvarez-iota1.vercel.app/'
            default:
                return ''
        }
    }
</script>

<div class="flex flex-col space-y-6 w-full h-full bg-{airdrop}-bg">
    <div class="h-2/6">
        <Illustration illustration="{airdrop}-airdrop-bg" />
    </div>
    <div class="h-1/6"></div>
    <div class="px-8 h-3/6">
        <Text type="h5" classes="mb-6 text-2xl text-{isAssembly() ? 'black' : 'white'}">{locale(`views.staking.airdrops.${airdrop}.name`)}</Text>
        <Text type="p" classes="mb-3 text-{isAssembly() ? 'black' : 'white'}">
            {locale(`views.staking.airdrops.${airdrop}.description`)}
        </Text>
        <Link onClick={handleLearnMoreClick} classes="text-{airdrop}-highlight">{locale('actions.learnMore')} ></Link>
        <HR classes="my-6" />
        <div class="flex flex-row space-x-2">
            <div class="flex flex-col w-1/2">
                <div>
                    <Text type="p" classes="font-bold text-2xl inline text-{isAssembly() ? 'black' : 'white'}">28</Text>
                    <Text type="p" secondary classes="text-lg inline">{locale('general.days')}</Text>
                </div>
                <Text type="p" secondary>{locale('views.staking.airdrops.remaining')}</Text>
            </div>
            <div class="flex flex-col w-1/2">
                <div>
                    <Text type="p" classes="font-bold text-2xl inline text-{isAssembly() ? 'black' : 'white'}">473.24</Text>
                    <Text type="p" secondary classes="text-lg inline">{AirdropToken[airdrop]}</Text>
                </div>
                <Text type="p" secondary>{locale('views.staking.airdrops.collectedRewards')}</Text>
            </div>
        </div>
    </div>
</div>

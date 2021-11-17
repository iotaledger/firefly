<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const handleExternalLinkClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }
</script>

<style>
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
</style>

<div class="flex flex-col space-y-6 w-full h-full bg-yellow-50">
    <div class="flex flex-col h-2/6">
        <div class="absolute flex flex-col justify-center self-center transform translate-y-10">
            <Text type="h5" classes="text-xl">{locale('views.staking.info.stakingIsLive')}</Text>
        </div>
        <Illustration illustration="staking-info" />
    </div>
    <div class="px-8 pb-6 h-3/6">
        <Text type="h5" classes="mb-6 text-2xl">
            {locale('views.staking.info.title')}
        </Text>
        <Text type="p" classes="mb-3">
            {locale('views.staking.info.description')}
        </Text>
        <ul class="mb-6">
            {#each locale('views.staking.info.bullets') as stakingInfoBullet}
                <li><Text type="p">{stakingInfoBullet}</Text></li>
            {/each}
        </ul>
        <Link onClick={handleExternalLinkClick} classes="self-center">
            {locale('actions.seeHowItWorks')} >
        </Link>
    </div>
</div>

<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakingEventState } from 'shared/lib/participation'

    export let locale: Locale

    const handleExternalLinkClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }
</script>

<style>
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 0.5em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
</style>

<div class="flex flex-col justify-between w-full h-full bg-yellow-50 dark:bg-gray-800">
    <div class="flex flex-col">
        <div class="absolute flex flex-col justify-center self-center transform translate-y-10">
            <Text type="h5" classes="text-xl">
                {$stakingEventState}
            </Text>
        </div>
        <Illustration illustration="staking-info" />
    </div>
    <div class="px-8 pb-10 flex justify-between flex-col">
        <Text type="h3" classes="mb-2">{locale('views.staking.info.title')}</Text>
        <div>
            <Text type="p" overrideColor smaller classes="text-gray-700 font-normal dark:text-white">
                {locale('views.staking.info.description')}
            </Text>
            <ul class="mb-6">
                {#each locale('views.staking.info.bullets') as stakingInfoBullet}
                    <li class="dark:text-white">
                        <Text type="p" smaller overrideColor classes="text-gray-700 font-normal dark:text-white">
                            {stakingInfoBullet}
                        </Text>
                    </li>
                {/each}
            </ul>
            <Link onClick={handleExternalLinkClick} classes="self-center text-14">{locale('actions.howItWorks')}</Link>
        </div>
    </div>
</div>

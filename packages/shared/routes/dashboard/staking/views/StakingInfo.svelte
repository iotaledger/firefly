<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
    import { stakingEventState } from 'shared/lib/participation'
    import { ParticipationEventState } from 'shared/lib/typings/participation'

    const handleExternalLinkClick = (): void => {
        Electron.openUrl('https://firefly.iota.org')
    }
</script>

<style type="text/scss">
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
        <div class="absolute flex flex-col text-center justify-center self-center transform translate-y-10">
            {#if $stakingEventState === ParticipationEventState.Upcoming || $stakingEventState === ParticipationEventState.Commencing}
                <Text type="p" secondary classes="font-normal text-xl">{localize(`views.staking.info.${$stakingEventState}Subheader`)}</Text>
            {/if}
            <Text type="h5" classes="text-xl">{localize(`views.staking.info.${$stakingEventState}`)}</Text>
        </div>
        <Illustration illustration="staking-info" />
    </div>
    <div class="px-8 pb-10 flex justify-between flex-col">
        <Text type="h3" classes="mb-2">{localize('views.staking.info.title')}</Text>
        <div>
            <Text type="p" overrideColor smaller classes="text-gray-700 font-normal dark:text-white">
                {localize('views.staking.info.description')}
            </Text>
            <ul class="mb-6">
                {#each localize('views.staking.info.bullets') as stakingInfoBullet}
                    <li class="dark:text-white">
                        <Text type="p" smaller overrideColor classes="text-gray-700 font-normal dark:text-white">
                            {stakingInfoBullet}
                        </Text>
                    </li>
                {/each}
            </ul>
            <Link onClick={handleExternalLinkClick} classes="self-center text-14">
                {localize('actions.howItWorks')}
            </Link>
        </div>
    </div>
</div>

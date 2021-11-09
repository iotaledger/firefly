<script lang="typescript">
    import { Button, StakingIndicator, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const handleStakeFundsClick = () => {
        /* eslint-disable no-console */
        console.log('STAKE!')
    }
</script>

<div class="p-8 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-row justify-between">
        <Text type="h5" classes="text-2xl">{locale('views.staking.title')}</Text>
        <StakingIndicator fundsStaked={true} />
    </div>
    <div class="h-2/6">
        <Text type="h5" classes="text-3xl">
            7.38 Gi
        </Text>
        <Text type="p" secondary>
            {locale('views.staking.manager.availableForStaking')}
        </Text>
    </div>
    <Button classes="w-full" onClick={handleStakeFundsClick}>
        {locale('actions.stakeFunds')}
    </Button>
</div>

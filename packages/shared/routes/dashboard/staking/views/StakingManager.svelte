<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const handleStakeFundsClick = () => {
        /* eslint-disable no-console */
        console.log('STAKE!')
    }
</script>

<div class="p-8 flex flex-col space-y-6 w-full h-full">
    <Text type="h5" classes="text-2xl h-1/6">{locale('views.staking.title')}</Text>
    <div class="h-1/3">
        <Text type="h5" classes="text-3xl">
            7.38 Gi
        </Text>
        <Text type="p" secondary>
            {locale('views.staking.manager.availableForStaking')}
        </Text>
    </div>
    <div class="1/6"></div>
    <div class="h-1/3">
        <Button classes="w-full" onClick={handleStakeFundsClick}>
            {locale('actions.stakeFunds')}
        </Button>
    </div>
</div>

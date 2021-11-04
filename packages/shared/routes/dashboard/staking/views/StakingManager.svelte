<script lang="typescript">
    import { Button, Text } from 'shared/components'

    const handleStakeFundsClick = () => {
        /* eslint-disable no-console */
        console.log('STAKE!')
    }
</script>

<div class="p-6 flex flex-col space-y-6 w-full h-full">
    <Text type="h5" classes="text-xl h-1/6">Staking</Text>
    <div class="h-1/3">
        <Text type="h5" classes="text-3xl">7.38 Gi</Text>
        <Text type="p" secondary>Available for staking</Text>
    </div>
    <div class="1/6"></div>
    <div class="h-1/3">
        <Button classes="w-full" onClick={handleStakeFundsClick}>
            Stake funds
        </Button>
    </div>
</div>

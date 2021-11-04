<script lang="typescript">
    import { Link, Text } from 'shared/components'

    const handleExternalLinkClick = () => {
        /* eslint-disable no-console */
        console.log('EXTERNAL FAQ!')
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

<div class="px-6 pb-6 flex flex-col space-y-3 w-full h-full">
    <div class="px-9 py-12 h-1/3">
        <Text type="p" classes="text-center text-xl">
            Staking events are live
        </Text>
    </div>
    <div class="flex flex-col justify-between h-2/3">
        <Text type="p" classes="text-xl">Staking in Firefly</Text>
        <div>
            <Text type="p" secondary>
                Claim SHM and ASM tokens ahead of the network launch in 2022.
                Staking temporarily locks your IOTAs, but you still have complete ownership and control at all times.
            </Text>
            <ul>
                <li>
                    <Text type="p" secondary>
                        Unstake to send or add to your staked funds.
                    </Text>
                </li>
                <li>
                    <Text type="p" secondary>
                        You can stake or unstake without limits.
                    </Text>
                </li>
                <li>
                    <Text type="p" secondary>
                        Rewards are continually airdropped to you.
                    </Text>
                </li>
            </ul>
        </div>
        <Link onClick="" classes="self-center" icon="info">How it works</Link>
    </div>
</div>

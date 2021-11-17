<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts } from '../lib/participation'

    export let locale: Locale

    $: stakingActive = $stakedAccounts.length
</script>

<div class="p-3 flex flex-row justify-between rounded-2xl bg-blue-100">
    <Icon icon="{stakingActive ? '' : 'un'}lock" classes="text-blue-500" />
    <Text type="p" classes="mx-2">
        {stakingActive ? 'Staking active' : 'Staking inactive'}
    </Text>
</div>

<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
    export let fundsStaked: boolean
</script>

<div class="p-3 flex flex-row justify-between rounded-2xl bg-blue-100">
    <Icon icon="{fundsStaked ? '' : 'un'}lock" classes="text-blue-500" />
    <Text type="p" classes="mx-2">
        Funds staked
        <!--{locale(`views.staking.manager.funds${fundsStaked ? 'Staked' : 'Unstaked'}`)}-->
    </Text>
</div>

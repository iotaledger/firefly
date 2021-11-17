<script lang="typescript">
    import { StakingIndicator, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
</script>

<div class="flex flex-row items-center py-5">
    <Text type="h5" classes="text-2xl mr-5">
        Staking
    </Text>
    <StakingIndicator />
</div>

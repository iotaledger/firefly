<script lang="typescript">
    import { StakingIndicator, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
</script>

<div class="flex flex-row justify-between items-center pb-8">
    <Text type="h1" classes="ml-2.5 mr-5">{localize('views.staking.title')}</Text>
    <StakingIndicator />
</div>

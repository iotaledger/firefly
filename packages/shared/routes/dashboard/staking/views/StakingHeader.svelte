<script lang="typescript">
    import { StakingIndicator, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
</script>

<div class="flex flex-row items-center pb-8">
    <Text type="h1" classes="ml-2.5 mr-5">
        {locale('views.staking.title')}
    </Text>
    <StakingIndicator />
</div>

<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'

    export let votingPower = 4528125

</script>

<div class='flex items-center mb-5 cursor-pointer' on:click={() => openPopup({ type: 'governanceVotingPowerInfo' })}>
    <Text type="p" classes="mr-2 text-gray-700" overrideColor smaller>{localize('views.governance.votingPower.title')}</Text>
    <Icon icon="info-filled" classes="flex-shrink-0 text-gray-500 dark:text-white w-3 h-3" />
</div>
<Text type="h1" classes="text-gray-800 inline-flex" overrideColor>{votingPower}</Text>
<Text type="h3" classes="inline-flex text-gray-800" overrideColor>{localize('views.governance.votes')}</Text>

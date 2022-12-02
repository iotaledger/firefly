<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ButtonSize, FontWeight, TextType } from './enums'

    const votingPowerBalance: string = '4821 SMR'
    const maximalVotingPower: string = '4821 SMR'

    function handleManageVotingPower(): void {
        return
    }
</script>

<voting-power>
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes="mb-4">
        {localize('views.governance.votingPower.title')}
    </Text>
    <Text type={TextType.h1}>{votingPowerBalance}</Text>
    <Text fontWeight={FontWeight.medium} overrideColor classes="mb-4 text-gray-600">
        {localize('views.governance.votingPower.maximal', { values: { value: maximalVotingPower } })}
    </Text>
    <Button size={ButtonSize.Medium} onClick={handleManageVotingPower} classes="w-full">
        {localize('views.governance.votingPower.manage')}
    </Button>
</voting-power>

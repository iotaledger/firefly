<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { buildAccountNetworkSettings } from 'shared/lib/wallet'

    // TODO: wait for developer profile PR to polish this
    let { localPow } = buildAccountNetworkSettings()
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.proofOfWork.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.proofOfWork.description')}</Text>
<Checkbox label={localize('actions.localProofOfWork')} bind:checked={localPow} />

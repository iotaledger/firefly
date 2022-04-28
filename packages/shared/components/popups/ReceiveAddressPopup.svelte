<script lang="typescript">
    import { Button, QR, Text } from 'shared/components'
    import { AddressBox } from 'shared/components/atoms'
    import { localize } from '@core/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { setClipboard } from 'shared/lib/utils'
    import { selectedAccount } from 'shared/lib/wallet'
    import { FontWeightText } from 'shared/components/Text.svelte'
</script>

<receive-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left">{localize('general.receiveFunds')}</Text>
    <div class="mb-6 flex w-full flex-col items-center space-y-6">
        <QR data={$selectedAccount.depositAddress} classes="w-1/2 h-1/2" />
        <Text secondary fontSize="xs">
            {localize('general.myNetworkAddress', {
                values: { networkName: $activeProfile.settings.networkConfig.network.name },
            })}
        </Text>
        <AddressBox address={$selectedAccount.depositAddress} />
        <Button
            classes="w-full"
            secondary
            onClick={() => setClipboard($selectedAccount.depositAddress)}
            autofocus={false}
        >
            <Text bigger color="blue-500">{localize('general.copyToClipboard')}</Text>
        </Button>
    </div>
</receive-details>

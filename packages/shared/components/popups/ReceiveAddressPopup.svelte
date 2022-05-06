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
        <AddressBox address={$selectedAccount.depositAddress} isCopyable />
    </div>
</receive-details>

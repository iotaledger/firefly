<script lang="typescript">
    import { QR, Text, FontWeight } from 'shared/components'
    import { AddressBox } from 'shared/components/atoms'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'

    $: receiveAddress = $selectedAccount.depositAddress
</script>

<receive-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">{localize('general.receiveFunds')}</Text>
    <div class="mb-6 flex w-full flex-col items-center space-y-6">
        <QR data={receiveAddress} classes="w-1/2 h-1/2" />
        <AddressBox address={receiveAddress} isCopyable />
    </div>
</receive-details>

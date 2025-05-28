<script lang="ts">
    import { QR, Text, FontWeight, AddressBox, HexAddressBox } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { isValidBech32AddressAndPrefix, BECH32_DEFAULT_HRP } from '@core/utils'

    export let title: string = localize('general.receiveFunds')

    let hasHexAddressToShow = false

    $: receiveAddress = $selectedAccount.depositAddress
    $: if (isValidBech32AddressAndPrefix(receiveAddress, BECH32_DEFAULT_HRP)) {
        hasHexAddressToShow = true
    }
</script>

<receive-details class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">{title}</Text>
    <div class="flex w-full flex-col items-center space-y-6">
        <QR data={receiveAddress} />
        <AddressBox address={receiveAddress} clearBackground isCopyable />
        {#if hasHexAddressToShow}
            <div class="w-3/4">
                <HexAddressBox address={receiveAddress} isCopyable />
            </div>
        {/if}
    </div>
</receive-details>

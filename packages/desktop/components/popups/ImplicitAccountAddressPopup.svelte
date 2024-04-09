<script lang="ts">
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet'
    import { CopyableBox, FontWeight, Text, TextType } from '@ui'

    let implicitAddress: string = ''
    $: $selectedWallet?.implicitAccountCreationAddress().then((address) => (implicitAddress = address))
</script>

<implicit-account-address-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
        >{localize('popups.implicitAccountAddress.title')}</Text
    >
    <Text type={TextType.p} classes="text-left">{localize('popups.implicitAccountAddress.subtitle')}</Text>
    <div class="flex flex-col space-y-2">
        <CopyableBox value={implicitAddress} isCopyable classes="w-full">
            <Text type={TextType.pre} fontSize="14" fontWeight={FontWeight.medium} color="gray-900" darkColor="white"
                >{implicitAddress}</Text
            >
        </CopyableBox>
    </div>
</implicit-account-address-popup>

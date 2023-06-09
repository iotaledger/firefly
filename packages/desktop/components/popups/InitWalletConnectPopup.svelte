<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { pairWithNewApp } from '@lib/walletconnect/utils'
    import { Button, Text, TextInput, FontWeight, TextType } from 'shared/components'

    let wcUri: string

    function onCancelClick(): void {
        closePopup()
    }

    function onConnectClick(): void {
        pairWithNewApp(wcUri)
        closePopup()
    }
</script>

<div class="space-y-6">
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        Connect with Application
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <TextInput bind:value={wcUri} label="Wallet Connect Code" placeholder="Paste here your Wallet Connect code" />
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onConnectClick}>Connect</Button>
    </div>
</div>

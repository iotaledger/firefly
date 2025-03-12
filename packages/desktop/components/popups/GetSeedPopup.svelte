<script lang="ts">
    import { localize } from '@core/i18n'
    import { Button, Logo, Text, TextType, KeyValueBox, TextHint } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { Logo as LogoEnum, TextHintVariant } from 'shared/components/enums'
    import { setClipboard } from '@core/utils'

    export let seed: string

    function onCancelClick(): void {
        closePopup()
    }
    function onCopyClick(): void {
        setClipboard(seed)
    }
</script>

<div class="flex w-full flex-col space-y-6">
    <Text type={TextType.h4}>Backup your seed</Text>
    <div class="flex flex-col space-y-4">
        <div class="w-full p-10 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
            <Logo width="50%" logo={LogoEnum.Stronghold} />
        </div>
        <div class="w-full space-y-3">
            <Text type={TextType.p} color="gray-700">
                It is important to back up your seed to ensure you have a copy of your wallets and transaction history.
                If you lose your seed and recovery phrase you will lose access to your funds.
            </Text>
            <TextHint
                variant={TextHintVariant.Warning}
                text="You can import this seed into the new IOTA rebased wallet to access your funds."
            />
            <KeyValueBox keyText="Seed" valueText={seed} isCopyable />
        </div>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button outline classes="w-1/2" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-1/2" onClick={onCopyClick}>
            {localize('actions.copy')}
        </Button>
    </div>
</div>

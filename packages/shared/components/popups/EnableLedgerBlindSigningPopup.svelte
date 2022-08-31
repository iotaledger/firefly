<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Text, Icon } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        ledgerDeviceStatus,
        ledgerMintNativeTokenConfirmationProps,
        ledgerSendConfirmationProps,
    } from '@core/ledger'
    import { closePopup, openPopup } from '@lib/popup'

    const STEPS = [1, 2, 3, 4]

    function onClosePopup(): void {
        if ($ledgerSendConfirmationProps) {
            openPopup({
                type: 'sendConfirmation',
                props: $ledgerSendConfirmationProps,
                overflow: true,
            })
        } else if ($ledgerMintNativeTokenConfirmationProps) {
            openPopup({
                type: 'mintNativeTokenForm',
                props: $ledgerMintNativeTokenConfirmationProps,
            })
        }
    }

    $: if ($ledgerDeviceStatus.blindSigningEnabled) {
        closePopup(true)
    }

    onDestroy(onClosePopup)
</script>

<Text type="h3" classes="mb-6">{localize('popups.enableLedgerBlindSigning.title')}</Text>

<div class="w-full h-full space-y-2 flex flex-auto flex-col flex-shrink-0">
    <div class="bg-yellow-50 w-full h-full space-y-6 rounded-md px-6 py-4">
        <span class="flex flex-row items-center	 space-x-4">
            <Icon boxed height={18} width={18} icon="info-filled" classes="text-yellow-700" />
            <Text type="p" fontSize="14" color="gray-700">{localize('popups.enableLedgerBlindSigning.info')}</Text>
        </span>
    </div>
    <div>
        {#each STEPS as step}
            <Text type="p" fontSize="15" color="gray-600" classes="my-2">
                {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`)}
            </Text>
        {/each}
    </div>
</div>

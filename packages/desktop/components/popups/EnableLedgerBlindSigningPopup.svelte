<script lang="ts">
    import { Text, Icon, TextType } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import {
        checkOrConnectLedger,
        ledgerNanoStatus,
        ledgerPreparedOutput,
        resetLedgerPreparedOutput,
    } from '@core/ledger'
    import { closeOverlay } from '@auxiliary/popup'
    import { sendOutput } from '@core/wallet'
    import { handleError } from '@core/error/handlers'

    const STEPS = [1, 2, 3, 4]

    $: if ($ledgerNanoStatus.blindSigningEnabled) {
        closeOverlay()
        checkOrConnectLedger(async () => {
            try {
                if ($ledgerPreparedOutput) {
                    await sendOutput($ledgerPreparedOutput)
                    resetLedgerPreparedOutput()
                }
            } catch (err) {
                handleError(err)
            }
        })
    }
</script>

<Text type={TextType.h3} classes="mb-6">{localize('popups.enableLedgerBlindSigning.title')}</Text>

<div class="w-full h-full space-y-2 flex flex-auto flex-col flex-shrink-0">
    <div class="bg-yellow-50 w-full h-full space-y-6 rounded-md px-6 py-4">
        <span class="flex flex-row items-center space-x-4">
            <Icon boxed height={18} width={18} icon={IconEnum.InfoFilled} classes="text-yellow-700" />
            <Text type={TextType.p} fontSize="14" color="gray-700" darkColor="gray-700"
                >{localize('popups.enableLedgerBlindSigning.info')}</Text
            >
        </span>
    </div>
    <div>
        {#each STEPS as step}
            <Text type={TextType.p} fontSize="15" color="gray-600" classes="my-2">
                {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`)}
            </Text>
        {/each}
    </div>
</div>

<script lang="typescript">
    import { Animation, KeyValueBox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'

    export let toAddress: string
    export let toAmount: string
    export let hash: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash
</script>

<Text type="h4" classes="mb-4">{localize('popups.ledgerTransaction.title')}</Text>
<Text type="p" classes="mb-4" secondary>{localize('popups.ledgerTransaction.info')}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if hash}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
    {/if}
</div>

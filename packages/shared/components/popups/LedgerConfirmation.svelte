<script>
    import { Icon, Text } from 'shared/components'

    export let locale

    export let fromAlias = ''

    export let toAddress = ''
    export let toAmount = 0

    export let remainderAddress = ''
    export let remainderAmount = 0

    let shouldDisplayDetails = fromAlias && toAddress && toAmount && remainderAddress && remainderAmount
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Icon icon="ledger" width="48" height="48" classes="mb-6 text-gray-800 dark:text-white" />
    {#if shouldDisplayDetails}
        <Text type="p" classes="mb-6 px-16">
            To proceed, confirm the following transaction details on your Ledger device:
        </Text>
        <div>
            <Text type="h5" highlighted classes="mb-3">
                From
            </Text>
            <Text type="p" classes="mb-6">
                {fromAlias}
            </Text>
        </div>
        <div>
            <Text type="h5" highlighted classes="mb-3">
                Send To
            </Text>
            <Text type="pre" classes="mb-6">
                {toAddress}
            </Text>
        </div>
        <div>
            <Text type="h5" highlighted classes="mb-3">
                Amount
            </Text>
            <Text type="p" classes="mb-6">
                {toAmount}
            </Text>
        </div>
        <div>
            <Text type="h5" highlighted classes="mb-3">
                Remainder
            </Text>
            <Text type="pre" classes="mb-6">
                {remainderAddress}
            </Text>
        </div>
        <div>
            <Text type="h5" highlighted classes="mb-3">
                Amount
            </Text>
            <Text type="pre" classes="mb-6">
                {remainderAmount}
            </Text>
        </div>
    {:else}
        <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.confirm')}</Text>
    {/if}
</div>

<script lang="ts">
    import { localize } from '@core/i18n'
    import { Subject, SubjectType } from '@core/wallet'
    import { Box, AddressBox, Text, WalletLabel, TextType, FontWeight } from '@ui'

    export let subject: Subject | null = null

    // TODO: update when multiwallet is implemented
    // https://github.com/iotaledger/firefly/issues/8362
    const isMultiwalletSupported = false
</script>

{#if subject?.type === SubjectType.Wallet}
    {#if isMultiwalletSupported}
        <Box row clearBackground clearPadding classes="justify-center">
            <WalletLabel wallet={subject?.wallet} />
        </Box>
    {/if}
{:else if subject?.type === SubjectType.Address}
    <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
{:else}
    <Box row clearBackground clearPadding classes="justify-center">
        <Text type={TextType.pre} fontSize="base" fontWeight={FontWeight.medium}>
            {localize('general.unknownAddress')}
        </Text>
    </Box>
{/if}

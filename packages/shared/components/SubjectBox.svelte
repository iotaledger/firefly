<script lang="ts">
    import { localize } from '@core/i18n'
    import { Subject, SubjectType } from '@core/wallet'
    import { Box, AddressBox, Text, WalletLabel, TextType, FontWeight } from '@ui'

    export let subject: Subject | null = null
</script>

{#if subject?.type === SubjectType.Wallet}
    <Box row clearBackground clearPadding classes="justify-center">
        <WalletLabel wallet={subject?.wallet} />
    </Box>
{:else if subject?.type === SubjectType.Address}
    <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
{:else}
    <Box row clearBackground clearPadding classes="justify-center">
        <Text type={TextType.pre} fontSize="base" fontWeight={FontWeight.medium}>
            {localize('general.unknownAddress')}
        </Text>
    </Box>
{/if}

<script lang="ts">
    import { localize } from '@core/i18n'
    import { Subject, SubjectType } from '@core/wallet'
    import { Box, AddressBox, Text, AccountLabel, TextType, FontWeight } from 'shared/components'

    export let subject: Subject | null = null
</script>

{#if subject?.type === SubjectType.Account}
    <Box row clearBackground clearPadding classes="justify-center">
        <AccountLabel account={subject?.account} />
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

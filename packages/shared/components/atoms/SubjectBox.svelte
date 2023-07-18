<script lang="ts">
    import { localize } from '@core/i18n'
    import { Subject } from '@core/wallet'
    import { Box, AddressBox, Text, AccountLabel, TextType, FontWeight } from 'shared/components'

    export let subject: Subject = null
</script>

{#if subject.type === 'account'}
    <Box row centered>
        <AccountLabel account={subject.account} />
    </Box>
{:else if subject.type === 'address'}
    <AddressBox clearBackground clearPadding isCopyable address={subject.address} />
{:else}
    <Box row centered>
        <Text type={TextType.pre} fontSize="base" fontWeight={FontWeight.medium}>
            {localize('general.unknownAddress')}
        </Text>
    </Box>
{/if}

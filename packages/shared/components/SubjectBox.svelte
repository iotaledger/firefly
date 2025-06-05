<script lang="ts">
    import { localize } from '@core/i18n'
    import { Subject, SubjectType } from '@core/wallet'
    import { Box, AddressBox, Text, AccountLabel, TextType, FontWeight, HexAddressBox } from 'shared/components'
    import { isValidBech32AddressAndPrefix, BECH32_DEFAULT_HRP } from '@core/utils'

    export let subject: Subject | null = null

    let hasHexAddressToShow = false

    $: if (isValidBech32AddressAndPrefix(subject?.address, BECH32_DEFAULT_HRP)) {
        hasHexAddressToShow = true
    }
</script>

{#if subject?.type === SubjectType.Account}
    <Box row clearBackground clearPadding classes="justify-center">
        <AccountLabel account={subject?.account} />
    </Box>
{:else if subject?.type === SubjectType.Address}
    <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
    {#if hasHexAddressToShow}
        <div class="w-3/4">
            <HexAddressBox address={subject?.address} isCopyable />
        </div>
    {/if}
{:else}
    <Box row clearBackground clearPadding classes="justify-center">
        <Text type={TextType.pre} fontSize="base" fontWeight={FontWeight.medium}>
            {localize('general.unknownAddress')}
        </Text>
    </Box>
{/if}

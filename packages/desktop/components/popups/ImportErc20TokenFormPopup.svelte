<script lang="ts">
    import { Button, ChainInput, Error, FontWeight, Text, TextInput, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { HEXADECIMAL_PREFIX, HEXADECIMAL_REGEXP } from 'shared/lib/core/utils'
    import { ERC20_TOKEN_ADDRESS_LENGTH } from 'shared/lib/core/layer-2'

    const error = ''

    let chainId: number

    let tokenAddress: string
    let tokenAddressError = ''
    $: tokenAddress, (tokenAddressError = '')

    function onCancelClick(): void {
        closePopup()
    }

    function onImportClick(): void {
        if (validate()) {
            console.log(`${tokenAddress} @ ${chainId}`)
        } else {
            console.log('INVALID!')
        }
    }

    function validate(): boolean {
        validateTokenAddress()

        return !tokenAddressError
    }

    function validateTokenAddress(): void {
        const hasHexPrefix = tokenAddress?.startsWith(HEXADECIMAL_PREFIX)
        const isValidHex = HEXADECIMAL_REGEXP.test(tokenAddress)
        if (!hasHexPrefix || !isValidHex) {
            tokenAddressError = localize('error.erc20TokenAddress.invalidFormat')
            return
        }

        const addressLength = tokenAddress?.substring(2)?.length
        if (addressLength !== ERC20_TOKEN_ADDRESS_LENGTH) {
            tokenAddressError = localize('error.erc20TokenAddress.invalidLength')
            return
        }
    }
</script>

<import-erc20-token-popup class="space-y-6">
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.importErc20Token.title')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <ChainInput bind:chainId />
        <TextInput
            bind:value={tokenAddress}
            label={localize('popups.importErc20Token.property.tokenAddress')}
            placeholder={localize('popups.importErc20Token.property.tokenAddress')}
            error={tokenAddressError}
        />
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={!chainId || !tokenAddress} onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onImportClick}>
            {localize('actions.import')}
        </Button>
    </div>
</import-erc20-token-popup>
